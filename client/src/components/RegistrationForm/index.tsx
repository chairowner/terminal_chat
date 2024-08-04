import { ChangeEvent, FC, FormEvent, MouseEvent, useState } from "react";
import s from "./index.module.scss";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { registration, login as toLogin } from "@/actions/user";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import Validator from "@/classes/Validator";

interface IValid {
	log: boolean;
	pass: boolean;
	next: boolean;
}

export const RegistrationForm: FC = () => {
	const isAuth: boolean = useSelector((state: any) => state.user.isAuth);
	const dispatch = useDispatch<any>();
	const [waiting, setWaiting] = useState<boolean>(false);
	const [login, setLogin] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [formInfo, setFormInfo] = useState<string>(
		"Come up with a username and password"
	);

	if (isAuth) {
		return <Navigate to="/" />;
	}

	const register = (e: FormEvent<HTMLFormElement>): void => {
		e.preventDefault();

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

		registration(login, password).then((res) => {
			setWaiting(false);
			setFormInfo(res.message);
			if (res.status) {
				dispatch(toLogin(login, password));
			}
		});
	};

	return (
		<form onSubmit={register} className={s.container}>
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
				type="submit"
				disabled={waiting}
				className={s.button}
				children={waiting ? "Waiting..." : "Register"}
			/>
			<Link
				to={"/login"}
				style={{ textDecoration: "none" }}
				onClick={(e) => {
					if (waiting) {
						e.preventDefault();
					}
				}}
			>
				<Button disabled={waiting} className={s.button}>
					{waiting ? "Waiting..." : "Already have an account? Log in"}
				</Button>
			</Link>
		</form>
	);
};
