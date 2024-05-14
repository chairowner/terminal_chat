import Response from "./Response";
import { IMessage } from "@/interfaces/database";
import { MessageModel } from "@/models/MessageModel";
import { UserModel } from "@/models/UserModel";
import e from "express";
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

	static async read(limit: number = 10): Promise<IMessage[]> {
		let data: IMessage[] = [];
		try {
			const options: FindOptions<MessageModel> = {
				limit,
				order: [["created_at", "ASC"]],
				include: [
					{
						model: UserModel,
						attributes: ["login"],
					},
				],
			};
			data = await MessageModel.findAll(options);
			this.log({ tag: "read", data });
		} catch (error) {
			console.error(error);
		}
		return data;
	}

	static async update(id: string, message: IMessage): Promise<void> {
		this.log({ tag: "update" });
		try {
			const where: WhereOptions<IMessage> = { id };
			await MessageModel.update(message, { where });
		} catch (error) {
			console.error(error);
		}
	}

	static async delete(id: string): Promise<void> {
		this.log({ tag: "delete" });
		try {
			await MessageModel.destroy({ where: { id } });
		} catch (error) {
			console.error(error);
		}
	}

	static log({ data, tag }: { data?: any; tag?: string }): void {
		console.log(this.tag, tag, data);
	}
}
