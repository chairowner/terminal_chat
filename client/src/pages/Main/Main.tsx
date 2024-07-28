import { FC } from "react";
import { Chat } from "@/components/Chat";
import { useSelector } from "react-redux";
import { About } from "../About";

const Main: FC = () => {
	const isAuth: boolean = useSelector((state: any) => state.user.isAuth);
	return isAuth ? <Chat /> : <About />;
};

export default Main;
