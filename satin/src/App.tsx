import { MantineProvider } from "@mantine/core";
import { theme } from "./util/theme";
import { Localization } from "./util/localization";

export function App() {
    return (
        <Localization>
            <MantineProvider
                theme={theme}
                defaultColorScheme="dark"
            ></MantineProvider>
        </Localization>
    );
}
