import { useMantineColorScheme } from "@mantine/core";
import { useConfig } from "../../contexts/config";
import { useEffect } from "react";

export function AppLayout() {
    const [colorScheme, setColorScheme] = useConfig("colorScheme", "dark");
    const csHook = useMantineColorScheme();

    useEffect(() => {
        csHook.setColorScheme(colorScheme ?? "auto");
    }, [colorScheme]);

    return <></>;
}
