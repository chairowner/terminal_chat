import { IMessage } from "@/interfaces/database";
import axios, { AxiosError, AxiosResponse } from "axios";

const API_URL: string = `${__SERVER_URL__}/api`;
const API_SUB = "messages";
const API_SUB_URL = `${API_URL}/${API_SUB}/`;

export interface ResponseMessage {
	message?: string;
	data: IMessage[];
}

export const getMessages = async (): Promise<ResponseMessage> => {
	const tag = "get";
	const url = API_SUB_URL + tag;
	try {
		const res: AxiosResponse = await axios.get(url);

		if (!res.data) {
			return { message: "messages are not found", data: [] };
		}

		return { data: res.data };
	} catch (_e) {
		if (axios.isAxiosError(_e)) {
			const e: AxiosError<{ message: string }> = _e;
			if (e.response?.data?.message) {
				return { message: e.response.data.message, data: [] };
			}
			return { message: "no server response", data: [] };
		}

		console.error(_e);

		return { message: "server error", data: [] };
	}
};
