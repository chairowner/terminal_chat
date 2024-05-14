import { Link } from "react-router-dom";
import s from "./Header.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/reducers/userReducer";

const debug: boolean = true;

export const Header = () => {
	const isAuth = useSelector((state: any) => state.user.isAuth);
	const dispatch = useDispatch<any>();

	return (
		<header className={s.container}>
			{isAuth ? (
				<>
					<Link to={"/"}>Chat</Link>
					<Link to={"/about"}>About</Link>
					<a onClick={() => dispatch(logout())}>Log out</a>
				</>
			) : (
				<>
					<Link to={"/"}>About</Link>
					<Link to={"/login"}>Log in</Link>
				</>
			)}
			{debug ? (
				<>
					<div>|</div>
					<Link to={"404"}>404</Link>
					<a
						href="http://127.0.0.1:15342"
						target="blank"
						style={{ cursor: "alias" }}
					>
						<span style={{ color: "#6c78af" }}>php</span>
						<span style={{ color: "#f89c0e" }}>MyAdmin</span>
					</a>
				</>
			) : null}
		</header>
	);
};
