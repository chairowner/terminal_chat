import { CSSProperties, FC, useEffect } from "react";
import { useTheme } from "@/contexts/Theme/context";
import { Header } from "./Header";
import { Body } from "./Body";
import "./App.scss";
import s from "./App.module.scss";
import { Hr } from "./Hr";
import { useDispatch } from "react-redux";
import { auth } from "@/actions/user";

export const App: FC = () => {
	const { theme } = useTheme();
	const dispatch = useDispatch<any>();

	useEffect(() => {
		dispatch(auth());
	}, []);

	return (
		<div style={{ ...(theme as CSSProperties) }} className={s.container}>
			<Header />
			<Hr />
			<Body />
		</div>
	);
};
