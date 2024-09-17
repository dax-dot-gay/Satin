import { useCallback, useContext, useEffect, useState } from "react";
import { ConfigProvider } from "./provider";
import { ConfigContext, ConfigKeys, DefaultConfig } from "./type";
import { emit, listen, UnlistenFn } from "@tauri-apps/api/event";
export { ConfigProvider };

export function useConfig<T extends keyof ConfigKeys>(
    key: T
): [ConfigKeys[T] | null, (value: ConfigKeys[T]) => void] {
    const { store } = useContext(ConfigContext);
    const [current, setCurrent] = useState<ConfigKeys[T] | null>(
        DefaultConfig[key]
    );

    useEffect(() => {
        store
            .get<ConfigKeys[T]>(key)
            .then((v) => setCurrent(v ?? DefaultConfig[key]));
    }, [store]);

    useEffect(() => {
        let unlisten: UnlistenFn | null = null;
        listen<void>("satin://fr/config-updated", () =>
            store
                .get<ConfigKeys[T]>(key)
                .then((v) => setCurrent(v ?? DefaultConfig[key]))
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

export function useSetConfig<T extends keyof ConfigKeys>(
    key: T
): (value: ConfigKeys[T]) => Promise<void> {
    const { store } = useContext(ConfigContext);

    const setConfig = useCallback(
        async (value: ConfigKeys[T]) => {
            await store.set(key, value);
            await emit("satin://fr/config-updated");
            await store.save();
        },
        [store, key]
    );

    return setConfig;
}
