import { ChangeEvent, FC, useState } from "react";
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
	const isAuth = useSelector((state: any) => state.user.isAuth);
	const [waiting, setWaiting] = useState<boolean>(false);
	const [login, setLogin] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const dispatch = useDispatch<any>();

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
		if (valid.next) {
			dispatch(toLogin(login, password)).then(() => {
				return setWaiting(false);
			});
		} else {
			console.log(valid);
		}
	};

	const logIn1 = (): void => {
		setWaiting(true);
	};

	return (
		<div className={s.container}>
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
				onClick={() => logIn()}
			/>
			<Button disabled={waiting} className={s.button}>
				<Link to={"/registration"} style={{ textDecoration: "none" }}>
					{waiting ? "Waiting..." : "No account? Create it!"}
				</Link>
			</Button>
		</div>
	);
};
