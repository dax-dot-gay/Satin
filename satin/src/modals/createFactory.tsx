import {
    ActionIcon,
    ActionIconGroup,
    AspectRatio,
    Button,
    Divider,
    Group,
    Paper,
    Stack,
    Text,
    TextInput,
    useComputedColorScheme,
    useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { ContextModalProps } from "@mantine/modals";
import {
    IconBuildingFactory2,
    IconFocus2,
    IconHome,
    IconMapPinFilled,
    IconMinus,
    IconPlus,
    IconX,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import {
    ReactZoomPanPinchRef,
    TransformComponent,
    TransformWrapper,
    useControls,
} from "react-zoom-pan-pinch";
import {
    IMAGE_SIZE,
    translateImageCoordinates,
} from "../util/satisfactoryMappings";
import { useCallback, useState } from "react";
import {
    emitDbEvent,
    useCollection,
    useDBOperations,
} from "../contexts/database";
import { Factory } from "../types/factory";
import { v4 } from "uuid";
import { showNotification } from "@mantine/notifications";
import { useDebouncedCallback } from "@mantine/hooks";
import { clamp } from "lodash";

function MapControls() {
    const controls = useControls();
    const theme = useComputedColorScheme();
    return (
        <ActionIconGroup orientation="vertical" className="map-controls">
            <ActionIcon
                onClick={() => controls.zoomIn()}
                variant={theme === "dark" ? "filled" : "white"}
                color={theme === "dark" ? "gray.9" : "gray.7"}
            >
                <IconPlus size={18} />
            </ActionIcon>
            <ActionIcon
                variant={theme === "dark" ? "filled" : "white"}
                color={theme === "dark" ? "gray.9" : "gray.7"}
                onClick={() => controls.centerView(0.2)}
            >
                <IconHome size={18} />
            </ActionIcon>
            <ActionIcon
                onClick={() => controls.zoomOut()}
                variant={theme === "dark" ? "filled" : "white"}
                color={theme === "dark" ? "gray.9" : "gray.7"}
            >
                <IconMinus size={18} />
            </ActionIcon>
        </ActionIconGroup>
    );
}

export function CreateFactoryModal({ context, id }: ContextModalProps<{}>) {
    const { t } = useTranslation();
    const form = useForm({
        initialValues: {
            name: "",
            location: { x: 0, y: 0 },
        },
    });
    const theme = useMantineTheme();
    const [startPosition, setStartPosition] = useState<{
        x: number;
        y: number;
    }>({ x: 0, y: 0 });
    const mappedPosition = translateImageCoordinates(form.values.location);
    const [scale, setScale] = useState(0.2);
    const { insert } = useDBOperations<Factory>("project", "factories");

    const onTransform = useDebouncedCallback((ref: ReactZoomPanPinchRef) => {
        const transformedX =
            (ref.state.positionX - startPosition.x) / ref.state.scale;
        const transformedY =
            (ref.state.positionY - startPosition.y) / ref.state.scale;
        setScale(ref.state.scale);
        form.setFieldValue("location", {
            x: transformedX,
            y: transformedY,
        });
    }, 10);

    return (
        <Stack gap="sm" className="create-factory-modal">
            <TextInput
                label={t("modals.createFactory.name.label")}
                placeholder={t("modals.createFactory.name.placeholder")}
                leftSection={<IconBuildingFactory2 size={20} />}
                {...form.getInputProps("name")}
            />
            <AspectRatio ratio={1} className="location-selection-wrapper">
                <Paper className="location-selector" shadow="md">
                    <TransformWrapper
                        minScale={0.2}
                        initialScale={0.2}
                        maxScale={1.8}
                        centerOnInit
                        limitToBounds={false}
                        panning={{ velocityDisabled: true }}
                        onTransformed={(ref) => {
                            const transformedX =
                                (ref.state.positionX - startPosition.x) /
                                ref.state.scale;
                            const transformedY =
                                (ref.state.positionY - startPosition.y) /
                                ref.state.scale;

                            if (
                                clamp(transformedX, -IMAGE_SIZE.x, 0) !=
                                    transformedX ||
                                clamp(transformedY, -IMAGE_SIZE.y, 0) !=
                                    transformedY
                            ) {
                                ref.setTransform(
                                    clamp(transformedX, -IMAGE_SIZE.x, 0) *
                                        ref.state.scale +
                                        startPosition.x,
                                    clamp(transformedY, -IMAGE_SIZE.y, 0) *
                                        ref.state.scale +
                                        startPosition.y,
                                    ref.state.scale,
                                    0
                                );
                            }
                            onTransform(ref);
                        }}
                        onInit={(ref) => {
                            form.setFieldValue("location", {
                                x: 0,
                                y: 0,
                            });
                            setStartPosition({
                                x: ref.state.positionX,
                                y: ref.state.positionY,
                            });
                        }}
                    >
                        {() => {
                            return (
                                <>
                                    <MapControls />
                                    <IconFocus2
                                        className="selected-location"
                                        color={theme.colors.dark[6]}
                                    />
                                    <TransformComponent>
                                        <img
                                            src="assets/map.jpg"
                                            alt={t(
                                                "modals.createFactory.location.alt"
                                            )}
                                        />
                                    </TransformComponent>
                                </>
                            );
                        }}
                    </TransformWrapper>
                </Paper>
            </AspectRatio>
            <Paper p="sm" className="paper-light">
                <Stack gap="xs">
                    <Group gap="sm">
                        <IconMapPinFilled size={20} />
                        <Text>{t("modals.createFactory.location.label")}</Text>
                    </Group>
                    <Group gap="sm" wrap="nowrap">
                        <Group gap="xs" style={{ flexGrow: 1 }}>
                            <Text>X</Text>
                            <Paper
                                p="xs"
                                className="paper-dark"
                                style={{ flexGrow: 1 }}
                            >
                                {mappedPosition.x}
                            </Paper>
                        </Group>
                        <Divider orientation="vertical" />
                        <Group gap="xs" style={{ flexGrow: 1 }}>
                            <Text>Y</Text>
                            <Paper
                                p="xs"
                                className="paper-dark"
                                style={{ flexGrow: 1 }}
                            >
                                {mappedPosition.y}
                            </Paper>
                        </Group>
                    </Group>
                </Stack>
            </Paper>
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
                    disabled={form.values.name.length === 0}
                    onClick={() =>
                        insert({
                            id: v4(),
                            name: form.values.name,
                            position: form.values.location,
                        }).then((v) => {
                            if (v) {
                                context.closeContextModal(id);
                            } else {
                                showNotification({
                                    color: "red",
                                    icon: <IconX />,
                                    title: t("notif.error"),
                                    message: t("modals.createFactory.error"),
                                });
                            }
                        })
                    }
                >
                    {t("actions.create")}
                </Button>
            </Group>
        </Stack>
    );
}
