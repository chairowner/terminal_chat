import { Helmet, HelmetProvider } from "react-helmet-async";
import s from "./NotFound.module.scss";
import { FC } from "react";

const NotFound: FC = () => {
	return (
		<HelmetProvider>
			<Helmet>
				<title>terminal_chat_404</title>
			</Helmet>
			<h1>404 NotFound</h1>
		</HelmetProvider>
	);
};

export default NotFound;
