import { Request, Response, NextFunction } from "express";

export function corsMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
	next();
}
