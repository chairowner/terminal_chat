import { setUser } from "@/reducers/userReducer";
import { Dispatch } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const API_URL: string = "http://localhost:3000/api/";
const API_SUB_URL = API_URL + "auth/";

export const registration = async (login: string, password: string) => {
	const tag = "registration";
	const url = API_SUB_URL + tag;
	try {
		const response = await axios.post(url, {
			login,
			password,
		});
		console.log(response.data.message);
	} catch (_e) {
		if (axios.isAxiosError(_e)) {
			const e: AxiosError<{ message: string }> = _e;
			if (e.response?.data?.message) {
				console.error(e.response.data.message);
			} else {
				console.error("no server response");
			}
		} else {
			console.error(_e);
			console.error(tag + " server error");
		}
	}
};

export const login = (login: string, password: string) => {
	const tag = "login";
	const url = API_SUB_URL + tag;
	return async (dispatch: Dispatch) => {
		try {
			const response = await axios.post(url, {
				login,
				password,
			});
			dispatch(setUser(response.data.user));
			localStorage.setItem("token", response.data.token);
		} catch (_e) {
			if (axios.isAxiosError(_e)) {
				const e: AxiosError<{ message: string }> = _e;
				if (e.response?.data?.message) {
					console.error(e.response.data.message);
				} else {
					console.error("no server response");
				}
			} else {
				console.error(tag + " server error");
			}
		}
	};
};

export const auth = () => {
	const tag = "auth";
	const url = API_SUB_URL + tag;
	return async (dispatch: Dispatch) => {
		try {
			const token: string | null = localStorage.getItem("token");
			if (!token) {
				return;
			}
			const response = await axios.get(url, {
				headers: { Authorization: "Bearer " + token },
			});
			dispatch(setUser(response.data.user));
			localStorage.setItem("token", response.data.token);
		} catch (_e) {
			if (axios.isAxiosError(_e)) {
				const e: AxiosError<{ message: string }> = _e;
				if (e.response?.data?.message) {
					console.error(e.response.data.message);
				} else {
					console.error("no server response");
				}
			} else {
				console.error("server error", _e);
			}
			localStorage.removeItem("token");
		}
	};
};
