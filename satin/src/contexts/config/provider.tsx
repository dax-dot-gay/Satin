import { Store } from "@tauri-apps/plugin-store";
import { ReactNode, useMemo } from "react";
import { ConfigContext, DefaultConfig } from "./type";
import { useSetReady } from "../readyState";

export function ConfigProvider({
    children,
}: {
    children?: ReactNode | ReactNode[];
}) {
    const setReady = useSetReady("config");
    const store = useMemo(() => {
        const store = new Store("config.bin");
        async function setDefaults() {
            for (const [key, value] of Object.entries(DefaultConfig)) {
                if (!(await store.has(key))) {
                    await store.set(key, value);
                }
            }
            setReady();
        }
        setDefaults();
        return store;
    }, []);

    return (
        <ConfigContext.Provider value={{ store }}>
            {children}
        </ConfigContext.Provider>
    );
}
