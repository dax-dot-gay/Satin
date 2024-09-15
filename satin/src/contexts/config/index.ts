import { useCallback, useContext, useEffect, useState } from "react";
import { ConfigProvider } from "./provider";
import { ConfigContext, ConfigKeys } from "./type";
import { emit, listen, UnlistenFn } from "@tauri-apps/api/event";
export { ConfigProvider };

export function useConfig<T extends keyof ConfigKeys>(
    key: T,
    default_value?: ConfigKeys[T]
): [ConfigKeys[T] | null, (value: ConfigKeys[T]) => void] {
    const { store } = useContext(ConfigContext);
    const [current, setCurrent] = useState<ConfigKeys[T] | null>(
        default_value ?? null
    );

    useEffect(() => {
        store
            .get<ConfigKeys[T]>(key)
            .then((v) => setCurrent(v ?? default_value ?? null));
    }, [store]);

    useEffect(() => {
        let unlisten: UnlistenFn | null = null;
        listen<void>("satin://fr/config-updated", () =>
            store
                .get<ConfigKeys[T]>(key)
                .then((v) => setCurrent(v ?? default_value ?? null))
        ).then((f) => (unlisten = f));
        return () => {
            if (unlisten) {
                unlisten();
            }
        };
    }, [setCurrent, store]);

    const setValue = useCallback(
        (value: ConfigKeys[T]) => {
            setCurrent(value);
            store.set(key, value).then(() => {
                emit("satin://fr/config-updated");
                store.save();
            });
        },
        [store, setCurrent]
    );

    return [current, setValue];
}
