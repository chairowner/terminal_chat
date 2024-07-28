import "@/styles/normalize.scss";
import "@/styles/index.scss";
import { StrictMode, Suspense } from "react";
import { createRoot, Root } from "react-dom/client";
import { Routes, Route, BrowserRouter } from "react-router-dom";
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

const container: Root = createRoot(root);

const AppRoutes = (): JSX.Element => (
	<Suspense fallback={<Loading />}>
		<Routes>
			<Route path="/" element={<App />}>
				<Route index element={<Main />} />
				<Route path="about" element={<About />} />
				<Route
					path="registration"
					element={<LoginPage pageType="registration" />}
				/>
				<Route path="login" element={<LoginPage pageType="login" />} />
				<Route path="*" element={<NotFound />} />
			</Route>
		</Routes>
	</Suspense>
);

container.render(
	<ThemeProvider>
		<Provider store={store}>
			<BrowserRouter>
				<AppRoutes />
			</BrowserRouter>
		</Provider>
	</ThemeProvider>
);
