import "@/styles/normalize.scss";
import "@/styles/index.scss";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import {
	RouteObject,
	RouterProvider,
	createBrowserRouter,
} from "react-router-dom";
import { App } from "@/components/App";
import { Main } from "@/pages/Main";
import { About } from "@/pages/About";
import { NotFound } from "@/pages/NotFound";
import { Loading } from "./pages/Loading";
import { ThemeProvider } from "./contexts/Theme/context";
import { Provider } from "react-redux";
import { store } from "./reducers";
import { LoginPage } from "./pages/LoginPage";

const root = document.getElementById("root");

if (!root) {
	throw new Error("root not found");
}

const container = createRoot(root);

let routerChildren: RouteObject[] = [
	{
		path: "/",
		element: <App />,
		children: [
			{
				index: true,
				path: "/",
				element: (
					<Suspense fallback={<Loading />}>
						<Main />
					</Suspense>
				),
			},
			{
				path: "/about",
				element: (
					<Suspense fallback={<Loading />}>
						<About />
					</Suspense>
				),
			},
			{
				path: "/registration",
				element: (
					<Suspense fallback={<Loading />}>
						<LoginPage pageType="registration" />
					</Suspense>
				),
			},
			{
				path: "/login",
				element: (
					<Suspense fallback={<Loading />}>
						<LoginPage pageType="login" />
					</Suspense>
				),
			},
			{
				path: "*",
				element: (
					<Suspense fallback={<Loading />}>
						<NotFound />
					</Suspense>
				),
			},
		],
	},
];

const router = createBrowserRouter(routerChildren);

container.render(
	<StrictMode>
		<ThemeProvider>
			<Provider store={store}>
				<RouterProvider router={router} />
			</Provider>
		</ThemeProvider>
	</StrictMode>
);
