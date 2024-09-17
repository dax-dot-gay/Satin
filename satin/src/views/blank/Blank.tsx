import { Stack } from "@mantine/core";
import { IconBuildingFactory2 } from "@tabler/icons-react";

export function BlankView() {
    return (
        <Stack gap="sm" className="new-project-menu">
            <IconBuildingFactory2 size={48} />
        </Stack>
    );
}
