import io, { Socket } from "socket.io-client";

const socket: Socket = io(__SOCKET_SERVER_URL__);

export const EVENT_NEW_MSG: string = "newMessage";
export const EVENT_GET_HISTORY: string = "getHistory";

export default socket;
