import "@mantine/modals";
import { CreateProjectModal } from "./createProject";

export const modals = {
    createProject: CreateProjectModal,
};

declare module "@mantine/modals" {
    export interface MantineModalsOverride {
        modals: typeof modals;
    }
}
