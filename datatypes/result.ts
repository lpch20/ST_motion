

export interface Result {
	result: ResultCode;
	message: string;
}

export interface ResultError extends Result {
	details: any;
}

export interface ResultWithData<T> extends Result {
	data?: T;
}

export enum ResultCode {
	OK = 1,
	Error = -1,
	ERROR_MULTIPLE_CALLS = -3
}
