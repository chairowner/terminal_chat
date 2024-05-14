import { ChangeEvent, FC, useState } from "react";
import s from "./index.module.scss";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { registration } from "@/actions/user";
import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import Validator from "@/classes/Validator";

interface IValid {
	log: boolean;
	pass: boolean;
	next: boolean;
}

export const RegistrationForm: FC = () => {
	const isAuth = useSelector((state: any) => state.user.isAuth);
	const [waiting, setWaiting] = useState<boolean>(false);
	const [login, setLogin] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	if (isAuth) {
		return <Navigate to="/" />;
	}

	const register = (): void => {
		setWaiting(true);
		const valid: IValid = {
			log: Validator.Login(login),
			pass: Validator.Password(password),
			next: false,
		};
		valid.next = valid.log && valid.pass;
		if (valid.next) {
			registration(login, password).then(() => {
				return setWaiting(false);
			});
		} else {
			console.log(valid);
		}
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
				children={waiting ? "Waiting..." : "Register"}
				onClick={() => register()}
			/>
			<Button disabled={waiting} className={s.button}>
				<Link to={"/login"} style={{ textDecoration: "none" }}>
					Already have an account? Log in
				</Link>
			</Button>
		</div>
	);
};
