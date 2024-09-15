import {
    ActionIcon,
    AppShell,
    Button,
    Divider,
    Group,
    Paper,
    Stack,
    Title,
    useComputedColorScheme,
    useMantineColorScheme,
} from "@mantine/core";
import { useConfig } from "../../contexts/config";
import { useEffect } from "react";
import {
    IconBuildingFactory2,
    IconMoonFilled,
    IconPlus,
    IconSunFilled,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

export function AppLayout() {
    const [colorScheme, setColorScheme] = useConfig("colorScheme", "dark");
    const csHook = useMantineColorScheme();
    const currentScheme = useComputedColorScheme("dark");
    const { t } = useTranslation();

    useEffect(() => {
        csHook.setColorScheme(colorScheme ?? "auto");
    }, [colorScheme]);

    return (
        <AppShell
            navbar={{ width: { sm: 256 }, breakpoint: "sm" }}
            padding="sm"
        >
            <AppShell.Navbar p="xs">
                <Stack gap="sm" h="100%">
                    <Paper
                        className="paper-light"
                        p="xs"
                        px="sm"
                        radius="sm"
                        shadow="sm"
                    >
                        <Group gap="sm" justify="space-between">
                            <IconBuildingFactory2 size={28} />
                            <Title order={4}>{t("common.appName")}</Title>
                        </Group>
                    </Paper>
                    <Divider />
                    <Stack
                        gap="sm"
                        style={{ flexGrow: 1 }}
                        className="factory-list"
                    ></Stack>
                    <Divider />
                    <Group gap="xs" wrap="nowrap">
                        <Button
                            leftSection={<IconPlus size={20} />}
                            style={{ flexGrow: 1 }}
                            justify="space-between"
                            variant={
                                currentScheme === "dark" ? "light" : "filled"
                            }
                        >
                            {t("views.layout.nav.addFactory")}
                        </Button>
                        <ActionIcon
                            size="36px"
                            variant={
                                currentScheme === "dark" ? "light" : "filled"
                            }
                            onClick={() =>
                                setColorScheme(
                                    currentScheme === "dark" ? "light" : "dark"
                                )
                            }
                        >
                            {currentScheme === "dark" ? (
                                <IconSunFilled size={20} />
                            ) : (
                                <IconMoonFilled size={20} />
                            )}
                        </ActionIcon>
                    </Group>
                </Stack>
            </AppShell.Navbar>

            <AppShell.Main>Main</AppShell.Main>
        </AppShell>
    );
}
