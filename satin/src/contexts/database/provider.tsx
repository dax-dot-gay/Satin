import { ReactNode, useCallback, useEffect, useState } from "react";
import { Database } from "tauri-plugin-polodb-api";
import { DatabaseContext, emitDbEvent } from "./types";
import { listen } from "@tauri-apps/api/event";
import { useConfig } from "../config";

export function DatabaseProvider({
    children,
}: {
    children?: ReactNode | ReactNode[];
}) {
    const [databases, setDatabases] = useState<{
        [key: string]: { db: Database; path: string };
    }>({});
    const dbState = Object.entries(databases)
        .map(([key, { path }]) => `${key}:${path}`)
        .join("/");

    const openDatabase = useCallback(
        async (key: string, path: string) => {
            if (
                databases[key] &&
                databases[key].path !== path &&
                !databases[key].db.closed
            ) {
                const success = await databases[key].db.close();
                if (success) {
                    await emitDbEvent("closed", {
                        key,
                        path: databases[key].path,
                    });
                } else {
                    await emitDbEvent("error", {
                        reason: "Failed to close existing database",
                    });
                    return null;
                }
            }

            const db = await Database.open(key, path);
            if (!db) {
                await emitDbEvent("error", {
                    reason: "Failed to open database",
                });
                return null;
            }

            setDatabases((current) => ({ ...current, [key]: { path, db } }));
            await emitDbEvent("opened", {
                key,
                path,
            });
            return db;
        },
        [setDatabases, dbState]
    );

    const [config] = useConfig("currentProject");

    useEffect(() => {
        if (config && config.path !== databases["project"]?.path) {
            openDatabase("project", config.path);
        }
    }, [config?.id, config?.name, config?.path]);

    return (
        <DatabaseContext.Provider value={{ openDatabase, databases }}>
            {children}
        </DatabaseContext.Provider>
    );
}
