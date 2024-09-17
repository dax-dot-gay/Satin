import { MantineProvider } from "@mantine/core";
import { theme } from "./util/theme";
import { Localization } from "./util/localization";
import { ConfigProvider } from "./contexts/config";
import { RouterProvider } from "react-router-dom";
import { appRouter } from "./util/routes";
import "./styles/index.scss";
import { ReadinessProvider } from "./contexts/readyState";
import { Notifications } from "@mantine/notifications";

export function App() {
    return (
        <ReadinessProvider>
            <Localization>
                <ConfigProvider>
                    <MantineProvider theme={theme} defaultColorScheme="dark">
                        <Notifications />
                        <RouterProvider router={appRouter} />
                    </MantineProvider>
                </ConfigProvider>
            </Localization>
        </ReadinessProvider>
    );
}
