import { ICreateUser, TableUser } from "@/classes/TableUser";
import { IUser } from "@/interfaces/database";
import { Request, Response, Router } from "express";
import bcrypt from "bcryptjs";
import {
	Result,
	ValidationError,
	check,
	validationResult,
} from "express-validator";
import { MinMaxOptions } from "express-validator/lib/options";
import jwt from "jsonwebtoken";
import cfg from "config";
import { authMiddleware } from "@/middleware/auth.middleware";
import { TableMessage } from "@/classes/TableMessage";

const messagesRouter: Router = Router();

const messageLengths: MinMaxOptions = {
	min: 1,
	max: 255,
};

messagesRouter.get(
	"/get",
	/* authMiddleware, */
	async function (req: any, res: Response) {
		try {
			const messages = await TableMessage.read(10);
			if (!messages) {
				return res.status(400).json({ message: "messages is not found" });
			}
			return res.json(messages);
		} catch (e) {
			return res.json({ message: "server error" });
		}
	}
);

export default messagesRouter;
