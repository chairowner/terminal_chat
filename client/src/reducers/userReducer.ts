const SET_USER = "SET_USER";
const LOGOUT = "LOGOUT";

export interface IUserStateCurrentUser {
	id: string;
	login: string;
}

export interface IUserState {
	currentUser: IUserStateCurrentUser;
	isAuth: boolean;
}

const defaultState = {
	currentUser: {},
	isAuth: false,
};

export function userReducer(state = defaultState, action: any) {
	switch (action.type) {
		case SET_USER:
			localStorage.removeItem("token");
			return {
				...state,
				currentUser: action.payload.user,
				isAuth: true,
			};
		case LOGOUT:
			localStorage.removeItem("token");
			return { ...state, currentUser: {}, isAuth: false };
		default:
			return state;
	}
}

export const setUser = (user: any) => ({ type: SET_USER, payload: { user } });
export const logout = () => ({ type: LOGOUT });
