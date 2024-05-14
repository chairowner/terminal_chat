import { FC, useEffect, useState } from "react";
import { History } from "./History";
import { ChatInput } from "./ChatInput";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useSelector } from "react-redux";
import { IMessage } from "@/interfaces/database";
import s from "./Chat.module.scss";
import socket, { EVENT_GET_HISTORY, EVENT_NEW_MSG } from "@/contexts/websocket";
import Validator from "@/classes/Validator";

export const Chat: FC = () => {
	const isAuth: boolean = useSelector((state: any) => state.user.isAuth);

	if (!isAuth) {
		return <div>No access</div>;
	}

	const userId: string | null = useSelector(
		(state: any) => state?.user?.currentUser?.id || null
	);

	const [history, setHistory] = useState<IMessage[]>([]);
	const [message, setMessage] = useState<string>("");
	const onChangeMessageTextarea = (text: string): void => {
		setMessage(text);
	};

	const renderMessage = (res: { message?: IMessage; error?: string }) => {
		// socket.emit(EVENT_GET_HISTORY, getHistory);
		if (!res?.message) {
			return;
		}
		setHistory((prev) =>
			[...prev, res.message].filter((msg): msg is IMessage => msg !== undefined)
		);
		setMessage("");
	};

	const sendMessage = (): void => {
		let msg = message.trim();
		if (!Validator.Message(msg)) {
			return console.log("sendMessage", "invalid message format", msg);
		}
		socket.emit(EVENT_NEW_MSG, { userId, message: msg }, renderMessage);
	};

	const getHistory = (res: IMessage[]): void => {
		setHistory(res);
	};

	useEffect(() => {
		if (!isAuth) {
			return;
		}

		// запрашиваем историю
		socket.emit(EVENT_GET_HISTORY, getHistory);

		// прослушиваем, не появилось ли нового сообщения
		socket.on(EVENT_NEW_MSG, (message: IMessage) => {
			setHistory((prev) => [...prev, message]);
		});

		return () => {
			socket.off(EVENT_NEW_MSG);
		};
	}, [isAuth]);

	return (
		<HelmetProvider>
			<Helmet>
				<title>terminal_chat_messages</title>
			</Helmet>
			<div className={s.container}>
				<History history={history} />
				<ChatInput
					message={message}
					onChangeTextarea={onChangeMessageTextarea}
					onClickButton={sendMessage}
				/>
			</div>
		</HelmetProvider>
	);
};
