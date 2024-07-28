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

const authRouter: Router = Router();

const passwordLengths: MinMaxOptions = {
	min: 3,
	max: 32,
};

const loginLengths: MinMaxOptions = {
	min: 3,
	max: 32,
};

authRouter.post(
	"/registration",
	[
		check(
			"login",
			`login must be longer than ${loginLengths.min} and shorter then ${loginLengths.max}`
		).isLength(loginLengths),
		check(
			"password",
			`password must be longer than ${passwordLengths.min} and shorter then ${passwordLengths.max}`
		).isLength(passwordLengths),
	],
	async function (req: Request, res: Response) {
		try {
			const errors: Result<ValidationError> = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(400).json({ message: "incorrect request", errors });
			}

			const { login, password }: ICreateUser = req.body;

			const candidate: IUser | null = await TableUser.findOne({ login });

			if (candidate) {
				return res.status(400).json({ message: "user already exists" });
			}

			const passwordHash: string = await bcrypt.hash(password, 8);

			const user: ICreateUser = {
				login,
				password: passwordHash,
			};

			await TableUser.create(user);

			return res.json({ message: "user was created" });
		} catch (e) {
			console.error(e);
			return res.json({ message: "registration error" });
		}
	}
);

const generateToken = (userId: string): string => {
	const payload: any = {
		id: userId,
	};
	const secretKey: string = cfg.get("secretKey");
	const options: jwt.SignOptions = {
		expiresIn: "1h",
	};
	return jwt.sign({ payload }, secretKey, options);
};

authRouter.post("/login", async function (req: Request, res: Response) {
	try {
		const { login, password }: ICreateUser = req.body;
		const user: IUser | null = await TableUser.findOne({ login });
		if (!user || !user.id) {
			return res.status(400).json({ message: "user or password is wrong" });
		}
		if (!bcrypt.compareSync(password, user.password)) {
			return res.status(400).json({ message: "user or password is wrong" });
		}
		return res.json({
			token: generateToken(user.id),
			user: {
				id: user.id,
				login: user.login,
			},
		});
	} catch (e) {
		console.error(e);
		return res.json({ message: "login error" });
	}
});

authRouter.get(
	"/auth",
	authMiddleware,
	async function (req: any, res: Response) {
		try {
			const user = await TableUser.findOne({ id: req.user.payload.id });
			if (!user || !user.id) {
				console.log(
					"[authRouter]",
					"[auth]",
					"user is not found",
					req?.user?.payload?.id
				);
				return res.status(400).json({ message: "user is not found" });
			}
			console.log("authRouter", "auth", "success", user.id);
			return res.json({
				token: generateToken(user.id),
				user: {
					id: user.id,
					login: user.login,
				},
			});
		} catch (e) {
			console.log("authRouter", "auth", "server error", res);
			return res.json({ message: "server error" });
		}
	}
);

export default authRouter;
