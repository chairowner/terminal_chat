import { ButtonHTMLAttributes, FC } from "react";
import s from "./Button.module.scss";
import classNames from "classnames";

export const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
	let buttonProps = {
		...props,
	};

	if (!buttonProps.type) {
		buttonProps.type = "button";
	}

	if (buttonProps.className) {
		buttonProps.className = classNames(s.button, buttonProps.className);
	} else {
		buttonProps.className = s.button;
	}

	if (!buttonProps.children) {
		buttonProps.children = "Save";
	}

	return <button {...buttonProps} />;
};
