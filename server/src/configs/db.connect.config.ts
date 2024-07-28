import { MessageModel } from "@/models/MessageModel";
import { UserModel } from "@/models/UserModel";
import { Sequelize, SequelizeOptions } from "sequelize-typescript";

const sequelizeOptions: SequelizeOptions = {
	dialect: "mariadb",
	database: "terminal_chat",
	username: "terminal_chat",
	password: "terminal_chat",
	host: "localhost",
	port: 3306,
	logging: false,
	dialectOptions: {
		connectTimeout: 60000,
	},
	models: [UserModel, MessageModel],
};

export const sequelize = new Sequelize(sequelizeOptions);
