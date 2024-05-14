import { Outlet } from "react-router-dom";
import s from "./Body.module.scss";

export const Body = () => {
	return (
		<div className={s.container}>
			<Outlet />
		</div>
	);
};
