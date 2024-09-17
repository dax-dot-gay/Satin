import { Stack } from "@mantine/core";
import { ContextModalProps } from "@mantine/modals";
import { useTranslation } from "react-i18next";

export function CreateFactoryModal({}: ContextModalProps<{}>) {
    const { t } = useTranslation();
    return <Stack gap="sm"></Stack>;
}
