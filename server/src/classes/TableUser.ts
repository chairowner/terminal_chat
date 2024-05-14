import Response from "./Response";
import { IUser } from "@/interfaces/database";
import { UserModel } from "@/models/UserModel";
import {
	ValidationError,
	UniqueConstraintError,
	WhereOptions,
} from "sequelize";

export type ICreateUser = Omit<
	IUser,
	"id" | "created_at" | "updated_at" | "last_online_at" | "banned" | "deleted"
>;

export class TableUser {
	private static tag = "TableUser";
	private static table = "users";

	static async create(data: ICreateUser): Promise<Response<string[]>> {
		const response = new Response<string[]>();
		try {
			const res: UserModel = await UserModel.create(data);
			response.info.push("Пользователь создан");
			response.status = true;
		} catch (_e) {
			let e: Error;
			if (_e instanceof Error) {
				e = _e;
			} else {
				e = new Error("Неизвестная ошибка");
			}

			if (e instanceof UniqueConstraintError) {
				const uniqueErr: UniqueConstraintError = e;
				Object.keys(uniqueErr.fields).map((field) => {
					response.info.push("Ошибка уникальности поля " + field);
				});
			} else if (e instanceof ValidationError) {
				e.errors.map((err) => {
					response.info.push(err.message);
				});
			} else {
				response.info.push(e.message);
			}

			response.status = false;
		}
		return response;
	}

	static async read(): Promise<IUser[]> {
		let data: IUser[] = [];
		try {
			data = await UserModel.findAll();
			// this.log({ tag: "read", data });
		} catch (error) {
			console.error(error);
		}
		return data;
	}

	static async find(where: WhereOptions<IUser>): Promise<IUser[]> {
		let data: IUser[] = [];
		try {
			data = await UserModel.findAll({ where });
			// this.log({ tag: "findByLogin", data });
		} catch (error) {
			console.error(error);
		}
		return data;
	}

	static async findOne(where: WhereOptions<IUser>): Promise<IUser | null> {
		let data: IUser | null = null;
		try {
			data = await UserModel.findOne({ where });
			// this.log({ tag: "findByLogin", data });
		} catch (error) {
			console.error(error);
		}
		return data;
	}

	static async update(id: number, user: IUser): Promise<void> {
		// this.log({ tag: "update" });
		try {
			await UserModel.update(user, { where: { id } });
		} catch (error) {
			console.error(error);
		}
	}

	static async delete(id: number): Promise<void> {
		// this.log({ tag: "delete" });
		try {
			await UserModel.destroy({ where: { id } });
		} catch (error) {
			console.error(error);
		}
	}

	static log({ data, tag }: { data?: any; tag?: string }): void {
		console.log(this.tag, tag, data);
	}
}
