import { FC } from "react";
import { RegistrationForm } from "@/components/RegistrationForm";
import { LoginForm } from "@/components/LoginForm";
import { Helmet, HelmetProvider } from "react-helmet-async";

export type PageType = "login" | "registration";

export interface ILoginPage {
	pageType: PageType;
}

const LoginPage: FC<ILoginPage> = ({ pageType }) => {
	return (
		<HelmetProvider>
			<Helmet>
				<title>
					{pageType === "login"
						? "terminal_chat_login"
						: "terminal_chat_register"}
				</title>
			</Helmet>
			{pageType === "login" ? (
				<>
					<h1>Login</h1>
					<LoginForm />
				</>
			) : (
				<>
					<h1>Registration</h1>
					<RegistrationForm />
				</>
			)}
		</HelmetProvider>
	);
};

export default LoginPage;
