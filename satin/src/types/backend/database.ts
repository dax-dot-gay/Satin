export type DBSingleton<T extends object> = {
    key: string;
} & T;
