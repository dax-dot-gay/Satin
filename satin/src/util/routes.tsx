import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../views/layout/Layout";
import { BlankView } from "../views/blank/Blank";

export const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [{ path: "/no-project", element: <BlankView /> }],
    },
]);
