import { MantineProvider } from "@mantine/core";
import { theme } from "./util/theme";
import { Localization } from "./util/localization";
import { ConfigProvider } from "./contexts/config";
import { RouterProvider } from "react-router-dom";
import { appRouter } from "./util/routes";
import "./styles/index.scss";
import { ReadinessProvider } from "./contexts/readyState";
import { Notifications } from "@mantine/notifications";
import { DatabaseProvider } from "./contexts/database";

export function App() {
    return (
        <ReadinessProvider>
            <Localization>
                <ConfigProvider>
                    <DatabaseProvider>
                        <MantineProvider
                            theme={theme}
                            defaultColorScheme="dark"
                        >
                            <Notifications />
                            <RouterProvider router={appRouter} />
                        </MantineProvider>
                    </DatabaseProvider>
                </ConfigProvider>
            </Localization>
        </ReadinessProvider>
    );
}
