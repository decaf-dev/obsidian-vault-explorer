import { moment } from "obsidian";

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
 * Gets the current time in milliseconds
 * @param date - The date to get the current time for. Can be in the format "YYYY-MM-DDTHH:mm:ss" or "YYYY-MM-DD"
 * @returns - The date in milliseconds
 */
export const getTimeMillis = (date: string) => {
	const formats = ["YYYY-MM-DDTHH:mm:ss", "YYYY-MM-DD"];
	const momentDate = moment(date, formats, true);

	if (!momentDate.isValid()) {
		throw new Error("Invalid date format");
	}
	return momentDate.valueOf();
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
