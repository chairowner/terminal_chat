import express, { Express } from "express";
import authRouter from "./routers/auth.routers";
import { sequelize } from "./configs/db.connect.config";
import { corsMiddleware } from "./middleware/cors.middleware";
import { setupSocketHandlers } from "./handlers/socketHandlers";
import { createServer as createHttpServer, Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import "dotenv/config";

const app: Express = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const SOCKET_PORT: number = process.env.SOCKET_PORT
	? parseInt(process.env.SOCKET_PORT)
	: 3001;

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

try {
	app.listen(PORT, async () => {
		console.log(`[SERVER][START][${PORT}]`);
	});
} catch (_e) {
	console.error("[SERVER][START_ERROR]", _e);
}

setupSocketHandlers(io);

try {
	server.listen(SOCKET_PORT, async () => {
		console.log(`[SOCKET][START][${SOCKET_PORT}]`);
	});
} catch (_e) {
	console.error("[SOCKET][START_ERROR]", _e);
}
