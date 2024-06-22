import { moment } from "obsidian";

const DATE_FORMATS = ["YYYY-MM-DDTHH:mm:ss", "YYYY-MM-DDTHH:mm", "YYYY-MM-DD"];

/**
 * Gets 12:00 AM of the current day in milliseconds
 * @returns - The current time in milliseconds
 */
export const getStartOfTodayMillis = () => {
	return moment().startOf("day").valueOf();
};

/**
 * Gets 12:00 AM of the day for the given date in milliseconds
 * @param date - The date to get the start of the day for
 * @returns - The start of the day in milliseconds
 */
export const getStartOfDayMillis = (date: string) => {
	return moment(date).startOf("day").valueOf();
}

/**
 * Gets 12:00 AM of the current week in milliseconds. The week starts on Sunday.
 * @returns - The start of the week in milliseconds
 */
export const getStartOfThisWeekMillis = () => {
	return moment().startOf("week").valueOf();
};

export const getMomentDate = (date: string) => {
	return moment(date, DATE_FORMATS, true);
}

export const getDateDaysAgo = (daysAgo: number) => {
	return moment().subtract(daysAgo, "days").format("YYYY-MM-DD");
}

export const getDateDaysAhead = (daysAgo: number) => {
	return moment().add(daysAgo, "days").format("YYYY-MM-DD");
}

/**
 * Gets 12:00 AM of the previous week in milliseconds. The week starts on Sunday.
 * @returns - The start of the previous week in milliseconds
 */
export const getStartOfLastWeekMillis = () => {
	//This is the Sunday the previous week
	return moment()
		.subtract(1, "weeks")
		.startOf("week")
		.valueOf();
};

/**
 * Gets the time in milliseconds
 * @param date - The date to get the time for.
 * @returns - The date in milliseconds
 */
export const getTimeMillis = (date: string) => {
	const momentDate = moment(date, DATE_FORMATS, true);

	if (!momentDate.isValid()) {
		throw new Error(`Date format not handled: ${date}`);
	}
	return momentDate.valueOf();
}

/**
 * Checks if the date is supported
 * @param date - The date to check if it is supported
 * @returns - True if the date is supported, false otherwise
 */
export const isDateSupported = (date: string) => {
	const momentDate = moment(date, DATE_FORMATS, true);
	return momentDate.isValid();
}

/**
 * Gets 11:59 PM of the current day in milliseconds
 * @param date - The date to get the end of the day for
 * @returns - The end of the day in milliseconds
 */
export const getEndOfDayMillis = (date: string) => {
	const day = moment(date);
	day.set({
		hour: 23,
		minute: 59,
		second: 59,
		millisecond: 999
	});
	return day.valueOf();
}
