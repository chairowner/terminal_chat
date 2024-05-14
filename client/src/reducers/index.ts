import { composeWithDevTools } from "@redux-devtools/extension";
import {
	Reducer,
	Store,
	applyMiddleware,
	combineReducers,
	createStore,
} from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import { userReducer } from "./userReducer";
import { messageReducer } from "./messageReducer";

const rootReducer: Reducer = combineReducers({
	user: userReducer,
	messages: messageReducer,
});

export const store: Store = createStore(
	rootReducer,
	composeWithDevTools(applyMiddleware(thunk))
);
