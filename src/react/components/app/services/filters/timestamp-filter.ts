import { TFile, moment } from "obsidian";
import { TimestampFilter } from "src/types";

export const filterByTimestamp = (file: TFile, timestampFilter: TimestampFilter) => {
	const midnightToday = moment().startOf("day").valueOf();
	const midnightThisWeek = moment().startOf("week").valueOf();

	//This is the Sunday the previous week
	const midnightLastWeek = moment()
		.subtract(1, "weeks")
		.startOf("week")
		.valueOf();

	if (timestampFilter === "modified-this-week") {
		return file.stat.mtime > midnightThisWeek;
	} else if (timestampFilter === "created-this-week") {
		return file.stat.ctime > midnightThisWeek;
	} else if (timestampFilter === "modified-2-weeks") {
		return file.stat.mtime > midnightLastWeek;
	} else if (timestampFilter === "created-2-weeks") {
		return file.stat.ctime > midnightLastWeek;
	} else if (timestampFilter === "modified-today") {
		return file.stat.mtime > midnightToday;
	} else if (timestampFilter === "created-today") {
		return file.stat.ctime > midnightToday;
	}
	return true;
}
