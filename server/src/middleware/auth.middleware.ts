import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import cfg from "config";

export function authMiddleware(req: any, res: Response, next: NextFunction) {
	if (req.method === "OPTIONS") {
		return next();
	}

	try {
		const tokenHeader: string | undefined = req.headers?.authorization;
		if (!tokenHeader) {
			return res.status(401).json({ message: "auth error" });
		}
		const tokenSplit: string[] = tokenHeader.split(" ");
		if (tokenSplit[0] !== "Bearer") {
			return res.status(401).json({ message: "auth error" });
		}
		if (!tokenSplit[1] || tokenSplit[1] === "null") {
			return res.status(401).json({ message: "auth error" });
		}
		const token: string = tokenSplit[1];
		const secretKey: string | undefined = cfg.get("secretKey");
		if (!secretKey) {
			return res.status(400).json({ message: "server error" });
		}
		req.user = jwt.verify(token, secretKey);
		next();
	} catch (e) {
		console.error("authMiddleware", e);
		return res.status(401).json({ message: "auth error" });
	}
}
