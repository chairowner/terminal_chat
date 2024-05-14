export interface IUser {
	id?: string;
	login: string;
	password: string;
	banned: boolean;
	deleted: boolean;
	created_at?: string;
	updated_at?: string;
	last_online_at?: string;
}

export interface IMessage {
	id?: string;
	userId: string;
	user: Partial<IUser>;
	text: string;
	deleted: boolean;
	created_at?: string;
}
