import {
    ActionIcon,
    Box,
    Button,
    Divider,
    Group,
    Stack,
    Title,
    useComputedColorScheme,
} from "@mantine/core";
import {
    IconBuildingFactory2,
    IconFolderOpen,
    IconMapPlus,
    IconMoonFilled,
    IconSunFilled,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useConfig } from "../../contexts/config";
import { openContextModal } from "@mantine/modals";

export function BlankView() {
    const { t } = useTranslation();
    const scheme = useComputedColorScheme();
    const [_, setColorScheme] = useConfig("colorScheme");
    return (
        <Box className="new-project-root">
            <ActionIcon
                className="new-project-theme-switch"
                size="36px"
                variant="light"
                onClick={() =>
                    setColorScheme(scheme === "dark" ? "light" : "dark")
                }
            >
                {scheme === "dark" ? (
                    <IconSunFilled size={20} />
                ) : (
                    <IconMoonFilled size={20} />
                )}
            </ActionIcon>
            <Stack gap="sm" className="new-project-menu">
                <Group gap="sm" justify="space-between">
                    <IconBuildingFactory2 size={48} />
                    <Stack gap={0} align="end">
                        <Title order={2}>{t("common.appName")}</Title>
                        <Title order={6} c="dimmed" fs="italic">
                            {t("common.appDescription")}
                        </Title>
                    </Stack>
                </Group>
                <Divider />
                <Button
                    justify="space-between"
                    px="sm"
                    size="md"
                    leftSection={<IconMapPlus />}
                    onClick={() =>
                        openContextModal({
                            modal: "createProject",
                            innerProps: {},
                            title: (
                                <Group gap="sm">
                                    <IconMapPlus />
                                    <Title order={3}>
                                        {t("modals.createProject.title")}
                                    </Title>
                                </Group>
                            ),
                        })
                    }
                >
                    {t("views.blank.createProject.button")}
                </Button>
                <Button
                    justify="space-between"
                    px="sm"
                    size="md"
                    leftSection={<IconFolderOpen />}
                >
                    {t("views.blank.openProject.button")}
                </Button>
            </Stack>
        </Box>
    );
}
