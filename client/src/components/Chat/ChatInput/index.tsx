import { ChangeEvent, FC, KeyboardEvent, MouseEvent } from "react";
import s from "./ChatInput.module.scss";

export const ChatInput: FC<{
	message: string;
	onChangeMessageTextarea(text: string): void;
	sendMessage(): void;
	waiting: boolean;
}> = ({ message, waiting, onChangeMessageTextarea, sendMessage }) => {
	const onChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
		onChangeMessageTextarea(e.currentTarget.value);
	};

	const onKeyDownHandler = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (!e.shiftKey && e.key === "Enter") {
			e.preventDefault();
			sendMessage();
		}
	};

	const onClickHandler = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		sendMessage();
	};

	return (
		<div className={s.container}>
			<textarea
				disabled={waiting}
				className={s.textarea}
				value={message}
				onChange={onChangeHandler}
				onKeyDown={onKeyDownHandler}
			/>
			<button
				disabled={waiting}
				className={s.button}
				type="submit"
				onClick={onClickHandler}
			>
				Enter
			</button>
		</div>
	);
};
