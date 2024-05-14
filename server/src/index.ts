import express from "express";
import authRouter from "./routers/auth.routers";
import messagesRouter from "./routers/messages.routers";
import { sequelize } from "./configs/db.connect.config";
import { corsMiddleware } from "./middleware/cors.middleware";
import { setupSocketHandlers } from "./handlers/socketHandlers";
import { createServer as createHttpServer, Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";

const app = express();
const PORT = process.env.PORT || 3000;
const SOCKET_PORT = process.env.SOCKET_PORT || 3002;

const server: HttpServer = createHttpServer(app);
const io: SocketServer = new SocketServer(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

sequelize.authenticate();
sequelize.sync();

app.use(corsMiddleware);
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/messages", messagesRouter);

setupSocketHandlers(io);

app.listen(PORT, async () => {
	console.log(`[SERVER][START][${PORT}]`);
});

server.listen(SOCKET_PORT, async () => {
	console.log(`[SOCKET][START][${SOCKET_PORT}]`);
});
