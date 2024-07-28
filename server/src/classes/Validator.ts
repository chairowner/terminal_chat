export interface IValidatorText {
	state: boolean;
	text: string;
}

export default class Validator {
	public static Message = (text: string): boolean => {
		try {
			return /^.{1,1000}$/mu.test(text);
		} catch (e) {
			console.error(e);
			return false;
		}
	};

	public static Login = (text: string): boolean => {
		try {
			return /^[a-zA-Z0-9_-]{1,100}$/u.test(text);
		} catch (e) {
			console.error(e);
			return false;
		}
	};

	public static Password = (text: string): boolean => {
		try {
			return /^.{6,}$/u.test(text);
		} catch (e) {
			console.error(e);
			return false;
		}
	};
}
