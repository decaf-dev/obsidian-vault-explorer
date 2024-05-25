import Logger, { ILogLevel } from "js-logger";
import { LOG_LEVEL_OFF, LOG_LEVEL_ERROR, LOG_LEVEL_WARN, LOG_LEVEL_INFO, LOG_LEVEL_DEBUG, LOG_LEVEL_TRACE } from "./constants";
import { FormattedLogMessage, LogMessageHeader } from "./types";


export const logLevelToString = (level: ILogLevel) => {
	switch (level) {
		case Logger.OFF:
			return LOG_LEVEL_OFF;
		case Logger.ERROR:
			return LOG_LEVEL_ERROR;
		case Logger.WARN:
			return LOG_LEVEL_WARN;
		case Logger.INFO:
			return LOG_LEVEL_INFO;
		case Logger.DEBUG:
			return LOG_LEVEL_DEBUG;
		case Logger.TRACE:
			return LOG_LEVEL_TRACE;
		default:
			throw new Error("Unhandled log level");
	}
}

export const stringToLogLevel = (value: string) => {
	switch (value) {
		case LOG_LEVEL_OFF:
			return Logger.OFF;
		case LOG_LEVEL_ERROR:
			return Logger.ERROR;
		case LOG_LEVEL_WARN:
			return Logger.WARN;
		case LOG_LEVEL_INFO:
			return Logger.INFO;
		case LOG_LEVEL_DEBUG:
			return Logger.DEBUG;
		case LOG_LEVEL_TRACE:
			return Logger.TRACE;
		default:
			throw new Error(`Unhandled log level: ${value}`);
	}
}

export const formatMessageForLogger = (...args: unknown[]): FormattedLogMessage => {
	const head: unknown = args[0];
	const body = args[1] as unknown as Record<string, unknown>;
	if (typeof args[0] == "object") {
		const headers = head as LogMessageHeader;
		const { fileName, functionName, message } = headers;
		return { message: `[${fileName}:${functionName}] ${message}`, data: body };
	} else {
		return { message: String(head), data: body };
	}
}
