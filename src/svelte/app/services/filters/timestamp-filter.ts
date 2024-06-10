import { TimestampFilter } from "src/types";

interface FilterByTimestampParams {
	timestampFilter: TimestampFilter;
	creationMillis: number;
	modifiedMillis: number;
	startOfTodayMillis: number;
	startOfThisWeekMillis: number;
	startOfLastWeekMillis: number;
}

export const filterByTimestamp = ({
	timestampFilter,
	creationMillis,
	modifiedMillis,
	startOfTodayMillis,
	startOfThisWeekMillis,
	startOfLastWeekMillis,
}: FilterByTimestampParams) => {
	if (timestampFilter === "modified-this-week") {
		return modifiedMillis > startOfThisWeekMillis;
	} else if (timestampFilter === "created-this-week") {
		return creationMillis > startOfThisWeekMillis;
	} else if (timestampFilter === "modified-2-weeks") {
		return modifiedMillis > startOfLastWeekMillis;
	} else if (timestampFilter === "created-2-weeks") {
		return creationMillis > startOfLastWeekMillis;
	} else if (timestampFilter === "modified-today") {
		return modifiedMillis > startOfTodayMillis;
	} else if (timestampFilter === "created-today") {
		return creationMillis > startOfTodayMillis;
	}
	return true;
}
