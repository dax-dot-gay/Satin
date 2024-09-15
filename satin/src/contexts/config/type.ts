import { Store } from "@tauri-apps/plugin-store";
import { createContext } from "react";

export type ConfigKeys = {
    colorScheme: "light" | "dark";
};

export type ConfigContextType = { store: Store };

export const ConfigContext = createContext<ConfigContextType>({
    store: new Store("config.bin"),
});
