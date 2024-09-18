import { emit } from "@tauri-apps/api/event";
import { createContext } from "react";
import { Database } from "tauri-plugin-polodb-api";

export type DatabaseContextType = {
    databases: { [key: string]: { db: Database; path: string } };
    openDatabase: (key: string, path: string) => Promise<Database | null>;
};

export const DatabaseContext = createContext<DatabaseContextType>({
    databases: {},
    openDatabase: async () => null,
});

export type DatabaseEventTypes = {
    opened: { key: string; path: string };
    closed: { key: string; path: string };
    error: { reason: string };
    write: { db: string; collection: string; document?: any };
};

export type DatabaseEventKey = keyof DatabaseEventTypes;
export type DatabaseEventPayload<T extends DatabaseEventKey> =
    DatabaseEventTypes[T];

export async function emitDbEvent<T extends DatabaseEventKey>(
    type: T,
    data: DatabaseEventPayload<T>
) {
    await emit(`satin://fr/database/${type}`, data);
}
