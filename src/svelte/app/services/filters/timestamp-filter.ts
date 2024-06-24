import { TimestampFilterOptions } from "src/types";

interface FilterByTimestampParams {
	timestampFilter: TimestampFilterOptions;
	createdMillis: number;
	modifiedMillis: number;
	startOfTodayMillis: number;
	startOfThisWeekMillis: number;
	startOfLastWeekMillis: number;
}

export const filterByTimestamp = ({
	timestampFilter,
	createdMillis,
	modifiedMillis,
	startOfTodayMillis,
	startOfThisWeekMillis,
	startOfLastWeekMillis,
}: FilterByTimestampParams) => {
	if (timestampFilter === "modified-this-week") {
		return modifiedMillis > startOfThisWeekMillis;
	} else if (timestampFilter === "created-this-week") {
		return createdMillis > startOfThisWeekMillis;
	} else if (timestampFilter === "modified-2-weeks") {
		return modifiedMillis > startOfLastWeekMillis;
	} else if (timestampFilter === "created-2-weeks") {
		return createdMillis > startOfLastWeekMillis;
	} else if (timestampFilter === "modified-today") {
		return modifiedMillis > startOfTodayMillis;
	} else if (timestampFilter === "created-today") {
		return createdMillis > startOfTodayMillis;
	}
	return true;
}
