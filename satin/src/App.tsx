import { MantineProvider } from "@mantine/core";
import { theme } from "./util/theme";
import { Localization } from "./util/localization";
import { ConfigProvider } from "./contexts/config";
import { RouterProvider } from "react-router-dom";
import { appRouter } from "./util/routes";
import "./styles/index.scss";

export function App() {
    return (
        <Localization>
            <ConfigProvider>
                <MantineProvider theme={theme} defaultColorScheme="dark">
                    <RouterProvider router={appRouter} />
                </MantineProvider>
            </ConfigProvider>
        </Localization>
    );
}
