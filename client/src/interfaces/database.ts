export interface IDBUser {
	id?: string;
	login: string;
	password: string;
	banned: boolean;
	deleted: boolean;
	created_at?: string;
	updated_at?: string;
	last_online_at?: string;
}

export interface IUser {
	id?: string;
	login: string;
	password: string;
	banned: boolean;
	deleted: boolean;
	created_at?: Date;
	updated_at?: Date;
	last_online_at?: Date;
}

export interface IDBMessage {
	id?: string;
	userId: string;
	user: Partial<IUser>;
	text: string;
	deleted: boolean;
	created_at?: string;
}

export interface IMessage {
	id?: string;
	userId: string;
	user: Partial<IUser>;
	text: string;
	deleted: boolean;
	created_at?: Date;
}

export const convertDBToMessage = (message: IDBMessage): IMessage => {
	return {
		id: message?.id,
		userId: message.userId,
		user: message.user,
		text: message.text,
		deleted: message.deleted,
		created_at: message?.created_at ? new Date(message?.created_at) : undefined,
	};
};

export const convertDBArrayToMessages = (
	messages: IDBMessage[]
): IMessage[] => {
	return messages
		.map((message) => convertDBToMessage(message))
		.filter((msg): msg is IMessage => msg !== undefined);
};
