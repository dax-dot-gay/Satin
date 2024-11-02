import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../views/layout/Layout";
import { BlankView } from "../views/blank/Blank";
import { FactoryPage } from "../views/factory/FactoryPage";

export const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            { path: "/no-project", element: <BlankView /> },
            {
                path: "/factory/:id",
                element: <FactoryPage />,
            },
        ],
    },
]);
