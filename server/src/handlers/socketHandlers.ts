import Response from "@/classes/Response";
import { TableMessage, CreateMessageInput } from "@/classes/TableMessage";
import Validator from "@/classes/Validator";
import { IMessage } from "@/interfaces/database";
import { DisconnectReason, Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import cfg from "config";
import { TableUser } from "@/classes/TableUser";

export const EVENT_USER_LEAVE: string = "userLeave";
export const EVENT_USER_LOGGED: string = "userLogged";
export const EVENT_NEW_MSG: string = "newMessage";
export const EVENT_GET_HISTORY: string = "getHistory";

export const setupSocketHandlers = (io: Server) => {
	console.log("setupSocketHandlers", "loaded");

	const SOCKET_TAG = "[socket]";

	io.use((socket: Socket, next) => {
		try {
			const token: string | undefined = socket.handshake.auth.token as
				| string
				| undefined;

			if (!token) {
				console.log(
					SOCKET_TAG,
					"[auth check]",
					"Authentication error: no token"
				);
				return next(new Error("Authentication error: no token"));
			}

			jwt.verify(token, cfg.get("secretKey"), (err, decoded: any) => {
				if (err) {
					console.log(
						SOCKET_TAG,
						"[auth check]",
						"Authentication error: token is wrong",
						token
					);
					return next(new Error("Authentication error: token is wrong"));
				}
				if (!decoded?.payload?.id) {
					return next(new Error("Authentication error: no payload data"));
				}
				socket.data.user = { id: decoded.payload.id };
				next();
			});
		} catch (_e) {
			console.error(SOCKET_TAG, "[authMiddleware]", _e);
			return next(new Error("Server error"));
		}
	});

	io.on("connection", (socket: Socket) => {
		console.log(SOCKET_TAG, "User", `(${socket.id})`, "connected");

		socket.on(
			EVENT_GET_HISTORY,
			async ({ page, limit }: { page?: number; limit?: number }, callback) => {
				try {
					const userId: string | undefined = socket?.data?.user?.id;
					if (!userId) {
						console.error(EVENT_GET_HISTORY, `(${socket.id})`, "auth error", {
							data: socket?.data?.user,
						});
						return callback({
							rows: [],
							count: 0,
						});
					}
					let offset: number | undefined = undefined;
					if (page && limit) {
						offset = (page - 1) * limit;
					}
					return callback(await TableMessage.read(offset, limit));
				} catch (_e) {
					console.error(
						EVENT_GET_HISTORY,
						`(${socket.id})`,
						"server error",
						_e
					);
					return callback({
						rows: [],
						count: 0,
					});
				}
			}
		);

		socket.on(EVENT_NEW_MSG, async (data: { message: string }, callback) => {
			const res: { message?: IMessage; error?: string } = {};
			const userId: string | undefined = socket?.data?.user?.id;

			if (!userId) {
				res.error = "auth error";
				console.error(EVENT_NEW_MSG, res.error);
				return res;
			}

			const findUser: { error?: string } = await TableUser.checkAuth(userId);
			if (findUser?.error) {
				res.error = findUser.error;
				console.error(EVENT_NEW_MSG, "findUser", res.error);
				return res;
			}

			let text = data.message.trim();
			if (!Validator.Message(text)) {
				res.error = "invalid message format";
				console.error(EVENT_NEW_MSG, res.error, text);
				return res;
			}

			try {
				const newMessage: CreateMessageInput = { userId, text };
				const resMsg: Response<IMessage> = await TableMessage.create(
					newMessage
				);
				if (resMsg.status && resMsg.data) {
					res.message = resMsg.data;
					socket.broadcast.emit(EVENT_NEW_MSG, res.message);
				} else {
					res.error = resMsg.info.length
						? resMsg.info.join(";")
						: "cannot create message";
				}
			} catch (e) {
				console.error(EVENT_NEW_MSG, "server error", e);
				res.error = "an error occurred while entering the message";
			}

			return callback(res);
		});

		socket.on("disconnect", (disconnectReason: DisconnectReason) => {
			console.log(
				SOCKET_TAG,
				`User (${socket.id}) disconnected`,
				`[${disconnectReason}]`
			);
			socket.broadcast.emit(EVENT_USER_LEAVE, { socketId: socket.id });
		});
	});
};
