import { ReactNode, useReducer } from "react";
import { ReadyContext, ReadyFlags, ReadyFlagType, ReadyState } from "./type";

export function ReadinessProvider({
    children,
}: {
    children?: ReactNode | ReactNode[];
}) {
    const [ready, setReady] = useReducer(
        (state: ReadyState, action: ReadyFlagType) => {
            state[action] = true;
            return state;
        },
        ReadyFlags.reduce((p, c) => ({ ...p, [c]: false }), {}) as ReadyState
    );

    return (
        <ReadyContext.Provider
            value={{
                state: ready,
                isReady: Object.values(ready).every((v) => v),
                setReady,
            }}
        >
            {children}
        </ReadyContext.Provider>
    );
}
