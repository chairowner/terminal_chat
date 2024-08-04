import { MessageModel } from "@/models/MessageModel";
import { UserModel } from "@/models/UserModel";
import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import "dotenv/config";

const database: string = process.env.DATABASE || "terminal_chat";
const username: string = process.env.DATABASE_USER || "terminal_chat";
const password: string = process.env.DATABASE_PASSWORD || "terminal_chat";
const host: string = process.env.DATABASE_HOST || "localhost";
const port: number = process.env.DATABASE_PORT
	? parseInt(process.env.DATABASE_PORT)
	: 3306;

const sequelizeOptions: SequelizeOptions = {
	dialect: "mariadb",
	database,
	username,
	password,
	host,
	port,
	logging: false,
	dialectOptions: {
		connectTimeout: 60000,
	},
	models: [UserModel, MessageModel],
};

export const sequelize = new Sequelize(sequelizeOptions);
