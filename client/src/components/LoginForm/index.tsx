import { ChangeEvent, FC, MouseEvent, useState } from "react";
import s from "./index.module.scss";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { login as toLogin } from "@/actions/user";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import Validator from "@/classes/Validator";

interface IValid {
	log: boolean;
	pass: boolean;
	next: boolean;
}

export const LoginForm: FC = () => {
	const isAuth: boolean = useSelector((state: any) => state.user.isAuth);
	const dispatch = useDispatch<any>();
	const [waiting, setWaiting] = useState<boolean>(false);
	const [login, setLogin] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [formInfo, setFormInfo] = useState<string>(
		"Enter a username and password"
	);

	if (isAuth) {
		return <Navigate to="/" />;
	}

	const logIn = (): void => {
		setWaiting(true);

		const valid: IValid = {
			log: Validator.Login(login),
			pass: Validator.Password(password),
			next: false,
		};

		valid.next = valid.log && valid.pass;

		if (!valid.next) {
			if (!valid.log && !valid.pass) {
				setFormInfo("Error filling in the fields");
			} else if (!valid.log) {
				setFormInfo("Error filling in the login field");
			} else {
				setFormInfo("Error filling in the password field");
			}
			return setWaiting(false);
		}

		dispatch(toLogin(login, password)).then((res: any) => {
			setWaiting(false);
			if (res?.message != null) {
				setFormInfo(res.message);
			}
		});
	};

	return (
		<div className={s.container}>
			<span className={s.item}>[{formInfo}]</span>
			<label className={s.item}>
				<span>Login:</span>
				<Input
					required={true}
					disabled={waiting}
					name="login"
					placeholder="Input a login..."
					className={s.input}
					value={login}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setLogin(e.target.value)
					}
				/>
			</label>
			<label className={s.item}>
				<span>Password:</span>
				<Input
					required={true}
					disabled={waiting}
					name="password"
					type="password"
					placeholder="Input a password..."
					value={password}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setPassword(e.target.value)
					}
					className={s.input}
				/>
			</label>
			<Button
				disabled={waiting}
				className={s.button}
				children={waiting ? "Waiting..." : "Login"}
				onClick={logIn}
			/>
			<Link
				to={"/registration"}
				onClick={(e) => {
					if (waiting) {
						e.preventDefault();
					}
				}}
				style={{ textDecoration: "none" }}
			>
				<Button disabled={waiting} className={s.button}>
					{waiting ? "Waiting..." : "No account? Create it!"}
				</Button>
			</Link>
		</div>
	);
};
