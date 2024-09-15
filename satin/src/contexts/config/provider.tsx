import { Store } from "@tauri-apps/plugin-store";
import { ReactNode, useMemo } from "react";
import { ConfigContext } from "./type";

export function ConfigProvider({
    children,
}: {
    children?: ReactNode | ReactNode[];
}) {
    const store = useMemo(() => new Store("config.bin"), []);

    return (
        <ConfigContext.Provider value={{ store }}>
            {children}
        </ConfigContext.Provider>
    );
}
