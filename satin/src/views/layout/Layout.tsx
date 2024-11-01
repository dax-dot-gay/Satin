import {
    ActionIcon,
    AppShell,
    Button,
    Divider,
    Group,
    Paper,
    Stack,
    Text,
    Title,
    useComputedColorScheme,
    useMantineColorScheme,
} from "@mantine/core";
import { useConfig } from "../../contexts/config";
import { useEffect, useState } from "react";
import {
    IconBuildingFactory2,
    IconMap,
    IconMapPin,
    IconMoonFilled,
    IconPlus,
    IconSunFilled,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useReady } from "../../contexts/readyState";
import { ModalsProvider, openContextModal } from "@mantine/modals";
import { modals } from "../../modals";
import { useQuery } from "../../contexts/database";
import { Factory } from "../../types/factory";

function FactoryItem({
    factory,
    selected,
    onSelect,
}: {
    factory: Factory;
    selected: boolean;
    onSelect: () => void;
}) {
    return (
        <Paper
            p="xs"
            radius="sm"
            shadow="xs"
            className="paper-light factory-item"
            style={{
                border: `1px solid ${
                    selected
                        ? "var(--mantine-primary-color-filled)"
                        : "var(--mantine-color-default-hover)"
                }`,
            }}
            onClick={onSelect}
        >
            <Stack gap={2}>
                <Text size="md">{factory.name}</Text>
                <Group gap={4}>
                    <IconMapPin size={16} />
                    <Text size="xs" c="dimmed">
                        {factory.position.x}, {factory.position.y}
                    </Text>
                </Group>
            </Stack>
        </Paper>
    );
}

export function AppLayout() {
    const ready = useReady();
    const nav = useNavigate();
    const location = useLocation();
    const [colorScheme, setColorScheme] = useConfig("colorScheme");
    const [currentProject, setCurrentProject] = useConfig("currentProject");
    const csHook = useMantineColorScheme();
    const currentScheme = useComputedColorScheme("dark");
    const [selectedFactory, setSelectedFactory] = useState<string | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        if (
            ready &&
            currentProject === null &&
            location.pathname !== "/no-project"
        ) {
            nav("/no-project");
        }
    }, [ready, currentProject?.path, location.pathname]);

    useEffect(() => {
        csHook.setColorScheme(colorScheme ?? "auto");
    }, [colorScheme]);

    const factories = useQuery<Factory, "many">("project", "factories");

    useEffect(() => {
        if (currentProject === null) {
            setSelectedFactory(null);
        }
    }, [setSelectedFactory, currentProject]);

    return (
        <ModalsProvider modals={modals}>
            <AppShell
                navbar={{
                    width: { sm: 256 },
                    breakpoint: "sm",
                    collapsed: {
                        desktop: location.pathname === "/no-project",
                        mobile: location.pathname === "/no-project",
                    },
                }}
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
                        <Group
                            justify="space-between"
                            gap="sm"
                            px="sm"
                            wrap="nowrap"
                        >
                            <IconMap />
                            <Title order={6}>{currentProject?.name}</Title>
                        </Group>
                        <Divider />
                        <Stack
                            gap="sm"
                            style={{ flexGrow: 1 }}
                            className="factory-list"
                        >
                            {factories.map((factory) => (
                                <FactoryItem
                                    factory={factory}
                                    selected={selectedFactory === factory.id}
                                    onSelect={() =>
                                        setSelectedFactory(
                                            selectedFactory === factory.id
                                                ? null
                                                : factory.id
                                        )
                                    }
                                    key={factory.id}
                                />
                            ))}
                        </Stack>
                        <Divider />
                        <Group gap="xs" wrap="nowrap">
                            <Button
                                leftSection={<IconPlus size={20} />}
                                style={{ flexGrow: 1 }}
                                justify="space-between"
                                onClick={() =>
                                    openContextModal({
                                        modal: "createFactory",
                                        innerProps: {},
                                        title: (
                                            <Group gap="sm">
                                                <IconPlus />
                                                <Title order={3}>
                                                    {t(
                                                        "modals.createFactory.title"
                                                    )}
                                                </Title>
                                            </Group>
                                        ),
                                        size: "lg",
                                    })
                                }
                            >
                                {t("views.layout.nav.addFactory")}
                            </Button>
                            <ActionIcon
                                size="36px"
                                onClick={() =>
                                    setColorScheme(
                                        currentScheme === "dark"
                                            ? "light"
                                            : "dark"
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

                <AppShell.Main>
                    <Outlet />
                </AppShell.Main>
            </AppShell>
        </ModalsProvider>
    );
}
