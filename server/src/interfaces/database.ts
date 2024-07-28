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

export interface IMessage {
	id?: string;
	userId: string;
	text: string;
	deleted: boolean;
	created_at?: Date;
}
