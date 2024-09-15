import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../views/layout/Layout";

export const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
    },
]);
