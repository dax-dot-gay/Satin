import { Store } from "@tauri-apps/plugin-store";
import { ReactNode, useMemo } from "react";
import { ConfigContext, DefaultConfig } from "./type";

export function ConfigProvider({
    children,
}: {
    children?: ReactNode | ReactNode[];
}) {
    const store = useMemo(() => {
        const store = new Store("config.bin");
        Object.entries(DefaultConfig).forEach(([key, value]) => {
            store.has(key).then((v) => {
                v && store.set(key, value).then(() => store.save());
            });
        });
        return store;
    }, []);

    return (
        <ConfigContext.Provider value={{ store }}>
            {children}
        </ConfigContext.Provider>
    );
}
