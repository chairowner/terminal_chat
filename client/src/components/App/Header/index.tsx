import { Link, Location, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/reducers/userReducer";
import s from "./Header.module.scss";
import classNames from "classnames";
import { CSSProperties, FC, MouseEventHandler, ReactNode } from "react";

interface IHeaderItem {
	type?: "lnk" | "a" | "div";
	path?: string;
	target?: "blank";
	style?: CSSProperties;
	onClick?: MouseEventHandler<HTMLAnchorElement>;
	children: ReactNode;
}

export const Header: FC = () => {
	const isAuth: boolean = useSelector((state: any) => state.user.isAuth);
	const dispatch: any = useDispatch<any>();
	const location: Location = useLocation();

	const renderItems = (isAuth: boolean) => {
		let items: IHeaderItem[] = isAuth
			? [
					{
						path: "/",
						children: "Chat",
					},
					{
						path: "/about",
						children: "About",
					},
					{
						type: "a",
						children: "Logout",
						onClick: () => {
							dispatch(logout());
						},
					},
			  ]
			: [
					{
						path: "/",
						children: "About",
					},
					{
						path: "/login",
						children: "Login",
					},
			  ];
		if (__DEBUG__) {
			items = items.concat([
				{
					type: "div",
					children: "|",
				},
				{
					path: "/404",
					children: "404",
				},
				{
					type: "a",
					path: "http://127.0.0.1:3307",
					children: (
						<>
							<span style={{ color: "#6c78af" }}>php</span>
							<span style={{ color: "#f89c0e" }}>MyAdmin</span>
						</>
					),
					target: "blank",
					style: { cursor: "alias" },
				},
			]);
		}
		console.log(typeof __DEBUG__);

		return (
			<>
				{items.map((item, index) => {
					switch (item?.type) {
						case "a":
							return (
								<a
									style={item?.style}
									key={index}
									href={item?.path}
									className={classNames(
										s.item,
										location.pathname === item?.path ? s.selected : null
									)}
									target={item?.target}
									onClick={item?.onClick}
									children={item.children}
								/>
							);

						case "div":
							return (
								<div
									style={item?.style}
									key={index}
									className={classNames(
										s.item,
										location.pathname === item?.path ? s.selected : null
									)}
								>
									{item.children}
								</div>
							);

						default:
							return (
								<Link
									key={index}
									style={item?.style}
									to={item?.path || "/404"}
									className={classNames(
										s.item,
										location.pathname === item?.path ? s.selected : null
									)}
									onClick={item?.onClick}
									children={item.children}
								/>
							);
					}
				})}
			</>
		);
	};

	return <header className={s.container}>{renderItems(isAuth)}</header>;
};
