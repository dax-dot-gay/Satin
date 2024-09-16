import { createContext } from "react";

export const ReadyFlags = ["config"] as const;
export type ReadyFlagType = (typeof ReadyFlags)[number];

export type ReadyState = { [key in ReadyFlagType]: boolean };
export type ReadyContextType = {
    state: ReadyState;
    isReady: boolean;
    setReady: (flag: ReadyFlagType) => void;
};

export const ReadyContext = createContext<ReadyContextType>(null as any);
