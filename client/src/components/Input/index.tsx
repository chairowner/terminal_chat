import { FC, InputHTMLAttributes } from "react";
import s from "./Input.module.scss";
import "./Input.scss";
import classNames from "classnames";

export const Input: FC<InputHTMLAttributes<HTMLInputElement>> = (props) => {
	let inputProps = {
		...props,
	};

	if (!inputProps.type) {
		inputProps.type = "text";
	}

	if (inputProps.className) {
		inputProps.className = classNames(s.input, inputProps.className);
	} else {
		inputProps.className = s.input;
	}

	return <input {...inputProps} />;
};
