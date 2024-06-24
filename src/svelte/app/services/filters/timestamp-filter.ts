import { TimestampFilterOption } from "src/types";

interface FilterByTimestampParams {
	value: TimestampFilterOption;
	createdMillis: number;
	modifiedMillis: number;
	startOfTodayMillis: number;
	startOfThisWeekMillis: number;
	startOfLastWeekMillis: number;
}

export const filterByTimestamp = ({
	value,
	createdMillis,
	modifiedMillis,
	startOfTodayMillis,
	startOfThisWeekMillis,
	startOfLastWeekMillis,
}: FilterByTimestampParams) => {
	if (value === "modified-this-week") {
		return modifiedMillis > startOfThisWeekMillis;
	} else if (value === "created-this-week") {
		return createdMillis > startOfThisWeekMillis;
	} else if (value === "modified-2-weeks") {
		return modifiedMillis > startOfLastWeekMillis;
	} else if (value === "created-2-weeks") {
		return createdMillis > startOfLastWeekMillis;
	} else if (value === "modified-today") {
		return modifiedMillis > startOfTodayMillis;
	} else if (value === "created-today") {
		return createdMillis > startOfTodayMillis;
	}
	return true;
}
