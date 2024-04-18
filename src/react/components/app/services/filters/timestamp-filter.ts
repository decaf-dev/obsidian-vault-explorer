import { TFile } from "obsidian";
import { TimestampFilter } from "src/types";

export const filterByTimestamp = (file: TFile, timestampFilter: TimestampFilter, {
	midnightToday,
	midnightThisWeek,
	midnightLastWeek,
}: {
	midnightToday: number;
	midnightThisWeek: number;
	midnightLastWeek: number;
}) => {
	const { mtime, ctime } = file.stat;
	if (timestampFilter === "modified-this-week") {
		return mtime > midnightThisWeek;
	} else if (timestampFilter === "created-this-week") {
		return ctime > midnightThisWeek;
	} else if (timestampFilter === "modified-2-weeks") {
		return mtime > midnightLastWeek;
	} else if (timestampFilter === "created-2-weeks") {
		return ctime > midnightLastWeek;
	} else if (timestampFilter === "modified-today") {
		return mtime > midnightToday;
	} else if (timestampFilter === "created-today") {
		return ctime > midnightToday;
	}
	return true;
}
