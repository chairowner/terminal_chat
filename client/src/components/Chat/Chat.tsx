import { FC, useEffect, useState, useRef, RefObject } from "react";
import { History } from "./History";
import { ChatInput } from "./ChatInput";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useSelector } from "react-redux";
import {
	IMessage,
	IDBMessage,
	convertDBToMessage,
	convertDBArrayToMessages,
} from "@/interfaces/database";
import s from "./Chat.module.scss";
import socket, { EVENT_GET_HISTORY, EVENT_NEW_MSG } from "@/contexts/websocket";
import Validator from "@/classes/Validator";

const HISTORY_MESSAGES_LIMIT: number = 30;

interface HistoryScrollPos {
	top: boolean;
	bottom: boolean;
}

const Chat: FC = () => {
	const isAuth: boolean = useSelector((state: any) => state?.user?.isAuth);

	if (!isAuth) {
		return <div>No access</div>;
	}

	const [message, setMessage] = useState<string>("");
	const [waiting, setWaiting] = useState<boolean>(false);
	const [history, setHistory] = useState<IMessage[]>([]);
	const historyRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
	const textAreaRef: RefObject<HTMLTextAreaElement> =
		useRef<HTMLTextAreaElement>(null);
	const [fetching, setFetching] = useState<boolean>(true);
	const [currentPage, setCurrentPage] = useState<number>(1);

	const focusTextArea = (): void => {
		if (textAreaRef?.current) {
			textAreaRef.current.focus();
		}
	};

	const scrollToBottom = (): void => {
		if (historyRef.current) {
			const t = setTimeout(() => {
				if (historyRef.current) {
					historyRef.current.scrollTop = historyRef.current.scrollHeight;
				}
				clearTimeout(t);
			}, 0);
		}
	};

	const onChangeMessageTextarea = (text: string): void => {
		setMessage(text);
	};

	const renderMessage = (res: { message?: IDBMessage; error?: string }) => {
		if (!res?.message) {
			setWaiting(false);
			focusTextArea();
			return console.error("renderMessage", res);
		}

		setHistory((prev) =>
			[...prev, convertDBToMessage(res?.message as IDBMessage)].filter(
				(msg): msg is IMessage => msg !== undefined
			)
		);

		setMessage("");
		scrollToBottom();
		setWaiting(false);
		focusTextArea();
	};

	const sendMessage = (): void => {
		setWaiting(true);

		const msg: string = message.trim();

		if (!Validator.Message(msg)) {
			setWaiting(false);
			focusTextArea();
			return console.error("sendMessage", "invalid message format", msg);
		}

		socket.emit(EVENT_NEW_MSG, { message: msg }, renderMessage);
	};

	const scrollHandler = (e: Event) => {
		const target = e.target as HTMLDivElement;
		if (target.scrollTop < 20) {
			setFetching(true);
		}
	};

	const getHistoryScrollPos = (offset: number = 100): HistoryScrollPos => {
		const response: HistoryScrollPos = {
			top: false,
			bottom: false,
		};

		if (!historyRef.current) return response;

		const target: HTMLDivElement = historyRef.current as HTMLDivElement;
		const { clientHeight, scrollHeight, scrollTop } = target;

		const maxScrollTop: number = scrollHeight - clientHeight;

		response.bottom = scrollTop >= maxScrollTop - offset;
		response.top = scrollTop <= offset;

		return response;
	};

	const getHistory = (data: { rows: IDBMessage[]; count: number }): void => {
		// берём позицию скролла до изменений
		const pos: HistoryScrollPos = getHistoryScrollPos();
		setHistory((prev) => {
			return [...convertDBArrayToMessages(data.rows), ...prev];
		});
		setCurrentPage((prev) => prev + 1);
		setFetching(false);

		const target: HTMLDivElement = historyRef.current as HTMLDivElement;
		// если мы видели низ (обычно его видно при первых запросах сообщений), опускаемся вниз
		if (pos.bottom) {
			return scrollToBottom();
		}
		// иначе сохраняем позицию скролла
		const oldTargetScrollHeight: number = target.scrollHeight;
		setTimeout(() => {
			target.scrollTo({ top: target.scrollHeight - oldTargetScrollHeight });
		}, 0);
	};

	useEffect(() => {
		if (!isAuth) return;

		// прослушиваем, не появилось ли нового сообщения
		socket.on(EVENT_NEW_MSG, (message: IDBMessage) => {
			setHistory((prev) => [...prev, convertDBToMessage(message)]);
			console.log("info", "new message!");
			// scrollToBottom();
			const pos: HistoryScrollPos = getHistoryScrollPos();
			if (pos.bottom) {
				return scrollToBottom();
			}
		});

		return () => {
			socket.off(EVENT_NEW_MSG);
		};
	}, [isAuth]);

	useEffect(() => {
		if (!fetching) {
			// указываем, что нужно подгрузить ещё сообщений, если не хватило первой партии
			const pos: HistoryScrollPos = getHistoryScrollPos();
			console.log(pos);
			if (pos.top && !pos.bottom) {
				setFetching(true);
			}
			return;
		}

		// запрашиваем партию сообщений
		socket.emit(
			EVENT_GET_HISTORY,
			{
				limit: HISTORY_MESSAGES_LIMIT,
				page: currentPage,
			},
			getHistory
		);
	}, [fetching]);

	useEffect(() => {
		if (historyRef.current) {
			historyRef.current.addEventListener("scroll", scrollHandler);
		}

		return () => {
			if (historyRef.current) {
				historyRef.current.removeEventListener("scroll", scrollHandler);
			}
		};
	}, []);

	useEffect(() => {
		if (!waiting) {
			focusTextArea();
		}
	}, [waiting]);

	return (
		<HelmetProvider>
			<Helmet>
				<title>terminal_chat_messages</title>
			</Helmet>
			<div className={s.container}>
				<History history={history} ref={historyRef} />
				<ChatInput
					textAreaRef={textAreaRef}
					waiting={waiting}
					message={message}
					onChangeMessageTextarea={onChangeMessageTextarea}
					sendMessage={sendMessage}
				/>
			</div>
		</HelmetProvider>
	);
};

export default Chat;
