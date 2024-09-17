import { ReactNode, useCallback, useMemo, useReducer, useState } from "react";
import { ReadyContext, ReadyFlags, ReadyFlagType, ReadyState } from "./type";

export function ReadinessProvider({
    children,
}: {
    children?: ReactNode | ReactNode[];
}) {
    const [ready, setReady] = useState<ReadyState>(
        ReadyFlags.reduce((p, c) => ({ ...p, [c]: false }), {}) as ReadyState
    );

    const trigger = useCallback(
        (name: ReadyFlagType) => {
            setReady((c) => ({ ...c, [name]: true }));
        },
        [setReady]
    );

    const isReady = Object.values(ready).every((v) => v === true);

    return (
        <ReadyContext.Provider
            value={{
                state: ready,
                isReady,
                setReady: trigger,
            }}
        >
            {children}
        </ReadyContext.Provider>
    );
}
