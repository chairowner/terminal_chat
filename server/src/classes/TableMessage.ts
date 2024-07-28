import Response from "./Response";
import { IMessage } from "@/interfaces/database";
import { MessageModel } from "@/models/MessageModel";
import { UserModel } from "@/models/UserModel";
import { FindOptions, WhereOptions } from "sequelize";

export type CreateMessageInput = Omit<
	IMessage,
	"id" | "created_at" | "deleted"
>;

export class TableMessage {
	private static tag = "TableMessage";
	private static table = "messages";

	static async create(data: CreateMessageInput): Promise<Response<IMessage>> {
		const response = new Response<IMessage>();
		try {
			const newMessage: IMessage = await MessageModel.create(data);
			if (newMessage?.id) {
				const where: WhereOptions<IMessage> = {
					id: newMessage?.id,
				};
				response.data = await MessageModel.findOne({
					where,
					include: [
						{
							model: UserModel,
							attributes: ["login"],
						},
					],
				});
				response.info.push("Сообщение занесено");
				response.status = true;
			} else {
				response.info.push("Не удалось занести сообщение");
				response.status = false;
			}
		} catch (error) {
			response.info.push(
				`[${this.tag}][${this.table}]: Ошибка при исполнении кода`
			);
			response.status = false;
		}
		return response;
	}

	static async read(
		offset?: number,
		limit: number = 30
	): Promise<{
		rows: IMessage[];
		count: number;
	}> {
		try {
			const options: FindOptions<MessageModel> = {
				limit,
				offset,
				order: [["created_at", "DESC"]],
				include: [
					{
						model: UserModel,
						attributes: ["login"],
					},
				],
			};
			const result = await MessageModel.findAndCountAll(options);
			result.rows.reverse();
			return result;
		} catch (_e) {
			console.error(_e);
			return {
				rows: [],
				count: 0,
			};
		}
	}

	static async getTotalCount(): Promise<number | null> {
		try {
			return await MessageModel.count();
		} catch (_e) {
			console.error(_e);
			return null;
		}
	}

	static async update(id: string, message: IMessage): Promise<void> {
		this.log({ tag: "update" });
		try {
			const where: WhereOptions<IMessage> = { id };
			await MessageModel.update(message, { where });
		} catch (_e) {
			console.error(_e);
		}
	}

	static async delete(id: string): Promise<void> {
		this.log({ tag: "delete" });
		try {
			await MessageModel.destroy({ where: { id } });
		} catch (_e) {
			console.error(_e);
		}
	}

	static log({ data, tag }: { data?: any; tag?: string }): void {
		console.log(this.tag, tag, data);
	}
}
