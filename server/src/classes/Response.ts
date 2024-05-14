export default class Response<T> {
	status: boolean;
	info: string[];
	data: T | null;

	constructor(
		status: boolean = false,
		info: string[] = [],
		data: T | null = null
	) {
		this.status = status;
		this.info = info;
		this.data = data;
	}
}
