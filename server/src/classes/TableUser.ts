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
			await UserModel.create(data);
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
		try {
			return await UserModel.findAll();
		} catch (_e) {
			console.error(_e);
			return [];
		}
	}

	static async find(where: WhereOptions<IUser>): Promise<IUser[]> {
		try {
			return await UserModel.findAll({ where });
		} catch (_e) {
			console.error(_e);
			return [];
		}
	}

	static async findOne(where: WhereOptions<IUser>): Promise<IUser | null> {
		try {
			return await UserModel.findOne({ where });
		} catch (_e) {
			console.error(_e);
			return null;
		}
	}

	static async checkAuth(id: string): Promise<{ error?: string }> {
		try {
			const findUser: IUser | null = await TableUser.findOne({ id });
			if (!findUser) {
				return { error: "auth error: user is not found" };
			}
			if (findUser.deleted) {
				return { error: "auth error: user is deleted" };
			}
			if (findUser.banned) {
				return { error: "auth error: user is banned" };
			}
			return {};
		} catch (_e) {
			console.error("[checkAuth]", id, _e);
			return { error: "server error" };
		}
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
