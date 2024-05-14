import { FC } from "react";
import s from "./About.module.scss";
import { Helmet, HelmetProvider } from "react-helmet-async";

const About: FC = () => {
	return (
		<HelmetProvider>
			<Helmet>
				<title>terminal_chat</title>
			</Helmet>
			<h1>About</h1>
			<p>
				This chat on WebSockets was created by{" "}
				<a href="https://github.com/chairowner" target="_blank">
					<b>chairowner</b>
				</a>{" "}
				in 2024 as part of the self-study of libraries.
			</p>
			<p>
				If you want to use its basis to implement your idea, take it at your own
				risk <span>(•‿•)</span>
			</p>
			<p>
				<span>Please inform me that you have taken the code.</span>{" "}
				<span>I will be glad to see your final result.</span>
			</p>
		</HelmetProvider>
	);
};

export default About;
