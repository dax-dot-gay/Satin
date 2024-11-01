import { useCallback, useContext, useEffect, useState } from "react";
import { DatabaseProvider } from "./provider";
import {
    DatabaseContext,
    DatabaseContextType,
    DatabaseEventKey,
    DatabaseEventPayload,
    DatabaseEventTypes,
    emitDbEvent,
} from "./types";
import { Collection, Database } from "tauri-plugin-polodb-api";
import { listen, UnlistenFn } from "@tauri-apps/api/event";

export type {
    DatabaseContextType,
    DatabaseEventKey,
    DatabaseEventPayload,
    DatabaseEventTypes,
};
export { DatabaseContext, DatabaseProvider, emitDbEvent };

export function useOpenDatabase() {
    return useContext(DatabaseContext).openDatabase;
}

export function useDatabase(key: string): Database | null {
    return useContext(DatabaseContext).databases[key]?.db ?? null;
}

export function useDatabases(): DatabaseContextType["databases"] {
    return useContext(DatabaseContext).databases;
}

export function useDatabaseEvent<T extends DatabaseEventKey>(
    key: T,
    callback: (payload: DatabaseEventPayload<T>) => void
) {
    useEffect(() => {
        let listener: null | UnlistenFn = null;
        listen<DatabaseEventPayload<T>>(`satin://fr/database/${key}`, (ev) =>
            callback(ev.payload)
        ).then((u) => {
            listener = u;
        });

        return () => {
            if (listener) {
                listener();
            }
        };
    }, [key, callback]);
}

export function useCollection<T extends object = any>(
    database: string,
    collection: string
) {
    const ctx = useContext(DatabaseContext);
    const [coll, setColl] = useState<Collection<T> | null>(
        ctx.databases[database]?.db.collection<T>(collection) ?? null
    );

    const updateCollection = useCallback(
        (ctx: DatabaseContextType) => {
            setColl(
                ctx.databases[database]?.db.collection<T>(collection) ?? null
            );
        },
        [setColl, database, collection]
    );

    const onUpdateEvent = useCallback(
        ({ key }: { key: string }) => {
            if (key == database) {
                updateCollection(ctx);
            }
        },
        [database, ctx]
    );

    useEffect(() => updateCollection(ctx), [ctx]);

    useDatabaseEvent("opened", onUpdateEvent);

    useDatabaseEvent("closed", onUpdateEvent);

    return coll;
}

export function useDBOperations<T extends object = any>(
    database: string,
    collection: string
) {
    const coll = useCollection<T>(database, collection);
    //console.log(coll);
    const opInsert = useCallback(
        async (...documents: T[]) => {
            if (coll && !coll.databaseObject.closed) {
                if ((await coll.insert(...documents)) === null) {
                    await emitDbEvent("error", {
                        reason: "Failed to insert document.",
                    });
                    return false;
                }
                await emitDbEvent("write", {
                    db: database,
                    collection,
                    document: documents,
                });
                return true;
            } else {
                await emitDbEvent("error", {
                    reason: "Database closed/nonexistent",
                });
                return false;
            }
        },
        [coll]
    );

    const opUpdate = useCallback(
        async (query: object, update: object, upsert?: boolean) => {
            if (coll && !coll.databaseObject.closed) {
                if ((await coll.update_many(query, update, upsert)) === null) {
                    await emitDbEvent("error", {
                        reason: "Failed to update documents.",
                    });
                    return false;
                }
                await emitDbEvent("write", {
                    db: database,
                    collection,
                });
                return true;
            } else {
                await emitDbEvent("error", {
                    reason: "Database closed/nonexistent",
                });
                return false;
            }
        },
        [coll]
    );

    const opDelete = useCallback(
        async (query: object) => {
            if (coll && !coll.databaseObject.closed) {
                if ((await coll.delete_many(query)) === null) {
                    await emitDbEvent("error", {
                        reason: "Failed to delete documents.",
                    });
                    return false;
                }
                await emitDbEvent("write", {
                    db: database,
                    collection,
                });
                return true;
            } else {
                await emitDbEvent("error", {
                    reason: "Database closed/nonexistent",
                });
                return false;
            }
        },
        [coll]
    );

    return {
        insert: opInsert,
        update: opUpdate,
        delete: opDelete,
    };
}

export function useQuery<
    T extends object = any,
    TMode extends "many" | "one" | undefined = undefined
>(
    database: string,
    collection: string,
    options?: {
        query?: object;
        sort?: object;
        mode?: TMode;
        default?: TMode extends "one" ? T | null : T[];
    }
): TMode extends "one" ? T | null : T[] {
    const coll = useCollection<T>(database, collection);
    const [value, setValue] = useState<T[]>(
        options?.default
            ? options?.mode === "one"
                ? ([options.default] as T[])
                : (options.default as T[])
            : []
    );

    const updateValue = useCallback(() => {
        if (coll && !coll.databaseObject.closed) {
            (options?.mode === "one" ? coll.find_one : coll.find)
                .bind(coll)(options?.query ?? {}, options?.sort)
                .then((v) => {
                    if (options?.mode === "one") {
                        if (v) {
                            setValue([v as T]);
                        } else {
                            setValue([]);
                        }
                    } else {
                        if (v) {
                            setValue(v as T[]);
                        } else {
                            setValue([]);
                        }
                    }
                });
        } else {
            setValue([]);
        }
    }, [coll, setValue]);

    useEffect(() => updateValue(), [updateValue]);

    useDatabaseEvent("write", updateValue);
    useDatabaseEvent("closed", updateValue);
    useDatabaseEvent("opened", updateValue);

    return (
        options?.mode === "one" ? value[0] ?? null : value
    ) as TMode extends "one" ? T | null : T[];
}
