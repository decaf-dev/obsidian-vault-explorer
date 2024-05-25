export interface FormattedLogMessage {
	message: string;
	data: Record<string, unknown> | null;
}

export interface LogMessageHeader {
	fileName: string;
	functionName: string;
	message: string;
}
