import { DefaultTheme } from "./configs/default.config";
import { ITheme, TypeTheme } from "./model";

export const Themes: Record<TypeTheme, ITheme> = {
	default: DefaultTheme,
};
