import { Store } from "@tauri-apps/plugin-store";
import { createContext } from "react";

export type ConfigKeys = {
    colorScheme: "light" | "dark";
    currentProject: {
        id: string;
        name: string;
        path: string;
        description: string;
    } | null;
};

export type ConfigContextType = { store: Store };

export const ConfigContext = createContext<ConfigContextType>({
    store: new Store("config.bin"),
});

export const DefaultConfig: ConfigKeys = {
    colorScheme: "dark",
    currentProject: null,
};
