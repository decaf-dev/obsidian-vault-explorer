import { moment } from "obsidian";

export const getMidnightToday = () => {
	const midnightToday = moment().startOf("day").valueOf();
	return midnightToday;
};

export const getMidnightThisWeek = () => {
	const midnightThisWeek = moment().startOf("week").valueOf();
	return midnightThisWeek;
};

export const getMidnightLastWeek = () => {
	//This is the Sunday the previous week
	const midnightLastWeek = moment()
		.subtract(1, "weeks")
		.startOf("week")
		.valueOf();

	return midnightLastWeek;
};
