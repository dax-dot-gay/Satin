import {
    ActionIcon,
    Button,
    Group,
    Stack,
    Textarea,
    TextInput,
} from "@mantine/core";
import { ContextModalProps } from "@mantine/modals";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";
import {
    IconArticle,
    IconCheck,
    IconFolder,
    IconFolderOpen,
    IconPencil,
    IconPlus,
    IconX,
} from "@tabler/icons-react";
import { open } from "@tauri-apps/plugin-dialog";
import { useCallback, useState } from "react";
import { v4 } from "uuid";
import { Project } from "../types/project";
import { DBSingleton } from "../types/backend/database";
import { showNotification } from "@mantine/notifications";
import { exists, mkdir } from "@tauri-apps/plugin-fs";
import { path } from "@tauri-apps/api";
import { useSetConfig } from "../contexts/config";
import { camelCase } from "lodash";
import { useNavigate } from "react-router-dom";
import { useDatabases, useOpenDatabase } from "../contexts/database";

export function CreateProjectModal({ context, id }: ContextModalProps<{}>) {
    const { t } = useTranslation();
    const form = useForm<{ name: string; description: string; path: string }>({
        initialValues: {
            name: "",
            description: "",
            path: "",
        },
    });
    const nav = useNavigate();
    const setCurrentProject = useSetConfig("currentProject");
    const [loading, setLoading] = useState(false);
    const databases = useDatabases();
    const openDatabase = useOpenDatabase();

    const createProject = useCallback(
        async (values: { name: string; description: string; path: string }) => {
            if (
                await exists(
                    await path.join(values.path, camelCase(values.name))
                )
            ) {
                showNotification({
                    color: "red",
                    icon: <IconX />,
                    title: t("notif.error"),
                    message: t("modals.createProject.existsError"),
                });
                return null;
            }
            let id = v4();
            await mkdir(await path.join(values.path, camelCase(values.name)));
            const database = await openDatabase(
                `project`,
                await path.join(values.path, camelCase(values.name))
            );
            if (database) {
                if (
                    (await database
                        .collection<DBSingleton<Project>>("meta")
                        .insert({
                            key: "project.main",
                            id,
                            ...values,
                            path: await path.join(
                                values.path,
                                camelCase(values.name)
                            ),
                        })) === null
                ) {
                    showNotification({
                        color: "red",
                        icon: <IconX />,
                        title: t("notif.error"),
                        message: t("modals.createProject.error"),
                    });
                    return null;
                }

                showNotification({
                    color: "green",
                    icon: <IconCheck />,
                    title: t("notif.success"),
                    message: t("modals.createProject.success"),
                });
                return { id, ...values } as Project;
            } else {
                showNotification({
                    color: "red",
                    icon: <IconX />,
                    title: t("notif.error"),
                    message: t("modals.createProject.error"),
                });
                return null;
            }
        },
        [t, databases]
    );

    return (
        <Stack gap="sm">
            <TextInput
                label={t("modals.createProject.name.label")}
                placeholder={t("modals.createProject.name.placeholder")}
                leftSection={<IconPencil size={20} />}
                withAsterisk
                {...form.getInputProps("name")}
            />
            <TextInput
                style={{ flexGrow: 1 }}
                label={t("modals.createProject.path.label")}
                placeholder={t("modals.createProject.path.placeholder")}
                description={t("modals.createProject.path.description")}
                leftSection={<IconFolder size={20} />}
                withAsterisk
                {...form.getInputProps("path")}
                readOnly
                rightSection={
                    <ActionIcon
                        variant="light"
                        size="md"
                        onClick={() =>
                            open({
                                directory: true,
                                multiple: false,
                                recursive: true,
                                canCreateDirectories: true,
                                title: t("modals.createProject.path.dialog"),
                            }).then((v) => {
                                if (v) {
                                    form.setFieldValue("path", v);
                                }
                            })
                        }
                    >
                        <IconFolderOpen size={16} />
                    </ActionIcon>
                }
            />
            <Textarea
                label={t("modals.createProject.description.label")}
                placeholder={t("modals.createProject.description.placeholder")}
                leftSection={<IconArticle size={20} />}
                {...form.getInputProps("description")}
                autosize
                minRows={3}
            />
            <Group gap="sm" justify="space-between" grow wrap="nowrap">
                <Button
                    leftSection={<IconX size={20} />}
                    variant="light"
                    justify="space-between"
                    onClick={() => context.closeContextModal(id, true)}
                >
                    {t("actions.cancel")}
                </Button>
                <Button
                    leftSection={<IconPlus size={20} />}
                    justify="space-between"
                    loading={loading}
                    disabled={
                        form.values.name.length === 0 ||
                        form.values.path.length === 0
                    }
                    onClick={() => {
                        setLoading(true);
                        createProject(form.values).then((result) => {
                            if (result) {
                                setCurrentProject(result).then(() => {
                                    context.closeModal(id, false);
                                    nav("/");
                                });
                            }
                            setLoading(false);
                        });
                    }}
                >
                    {t("actions.create")}
                </Button>
            </Group>
        </Stack>
    );
}
