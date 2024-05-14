import { ChangeEvent, FC, MouseEvent, useState } from "react";
import s from "./ChatInput.module.scss";

export const ChatInput: FC<{
	message: string;
	onChangeTextarea(text: string): void;
	onClickButton(): void;
}> = ({ message, onChangeTextarea, onClickButton }) => {
	return (
		<div className={s.container}>
			<textarea
				className={s.textarea}
				value={message}
				onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
					onChangeTextarea(e.target.value)
				}
			/>
			<button
				className={s.button}
				type="submit"
				onClick={(e: MouseEvent<HTMLButtonElement>) => {
					e.preventDefault();
					onClickButton();
				}}
			>
				Enter
			</button>
		</div>
	);
};
