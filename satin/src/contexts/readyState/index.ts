import {
    ReadyFlagType,
    ReadyContextType,
    ReadyContext,
    ReadyFlags,
    ReadyState,
} from "./type";
import { ReadinessProvider } from "./provider";
import { useCallback, useContext } from "react";

export { ReadyFlags, ReadinessProvider };
export type { ReadyContextType, ReadyFlagType, ReadyState };

export function useReady(): boolean {
    return useContext(ReadyContext).isReady;
}

export function useSetReady(flag: ReadyFlagType) {
    let context = useContext(ReadyContext);
    return useCallback(() => context.setReady(flag), [context.setReady, flag]);
}
