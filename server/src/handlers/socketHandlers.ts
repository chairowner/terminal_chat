// socketHandlers.ts
import Response from "@/classes/Response";
import { TableMessage, CreateMessageInput } from "@/classes/TableMessage";
import Validator from "@/classes/Validator";
import { IMessage } from "@/interfaces/database";
import { DisconnectReason, Server, Socket } from "socket.io";

export const EVENT_NEW_MSG: string = "newMessage";
export const EVENT_GET_HISTORY: string = "getHistory";

export const setupSocketHandlers = (io: Server) => {
	console.log("setupSocketHandlers", "loaded");

	io.on("connection", (socket: Socket) => {
		console.log("User", `(${socket.id})`, "connected");

		socket.on(EVENT_GET_HISTORY, async (callback) => {
			console.log("socket", EVENT_GET_HISTORY);
			try {
				const messages = await TableMessage.read(10);
				return callback(messages);
			} catch (err) {
				console.error("User", `(${socket.id})`, EVENT_GET_HISTORY, "error");
				return callback([]);
			}
		});

		socket.on(
			EVENT_NEW_MSG,
			async (data: { userId: string; message: string }, callback) => {
				console.log("socket", EVENT_NEW_MSG, { data, callback });
				const res: { message?: IMessage; error?: string } = {};

				let text = data.message.trim();
				if (!Validator.Message(text)) {
					res.error = "invalid message format";
					console.error("sendMessage", res.error, text);
					return res;
				}

				try {
					const newMessage: CreateMessageInput = { userId: data.userId, text };
					const resMsg: Response<IMessage> = await TableMessage.create(
						newMessage
					);
					if (resMsg.status && resMsg.data) {
						res.message = resMsg.data;
					} else {
						res.error = resMsg.info.length
							? resMsg.info.join(";")
							: "cannot create message";
					}
				} catch (e) {
					console.error("sendMessage", "server error", e);
					res.error = "an error occurred while entering the message";
				}

				return callback(res);
			}
		);

		socket.on("disconnect", (disconnectReason: DisconnectReason) => {
			console.log(
				"User",
				`(${socket.id})`,
				"disconnected",
				`[${disconnectReason}]`
			);
		});
	});
};
