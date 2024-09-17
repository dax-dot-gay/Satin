import "@mantine/modals";
import { CreateProjectModal } from "./createProject";
import { CreateFactoryModal } from "./createFactory";

export const modals = {
    createProject: CreateProjectModal,
    createFactory: CreateFactoryModal,
};

declare module "@mantine/modals" {
    export interface MantineModalsOverride {
        modals: typeof modals;
    }
}
