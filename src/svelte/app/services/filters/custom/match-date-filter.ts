import { getEndOfDayMillis, getStartOfDayMillis, getTimeMillis, isDateSupported } from "src/svelte/shared/services/time-utils";
import { DateFilterCondition } from "src/types";

export const matchDateFilter = (
	propertyValue: string | null,
	compare: string,
	condition: DateFilterCondition,
	matchIfNull: boolean
) => {
	if (propertyValue) {
		console.assert(isDateSupported(propertyValue), `DateFilter propertyValue "${propertyValue}" must be supported date format`);
	}
	console.assert(isDateSupported(compare), `DateFilter compare "${compare}" must be supported date format`);

	switch (condition) {
		case DateFilterCondition.IS: {
			if (propertyValue === null) return matchIfNull;

			const propertyValueTime = getTimeMillis(propertyValue);
			const dayStartTime = getStartOfDayMillis(compare);
			const dayEndTime = getEndOfDayMillis(compare);

			return (
				propertyValueTime >= dayStartTime &&
				propertyValueTime <= dayEndTime
			);
		}

		case DateFilterCondition.IS_AFTER: {
			if (propertyValue === null) return matchIfNull;
			if (!isDateSupported(compare)) return true;

			const propertyValueTime = getTimeMillis(propertyValue);
			const dayEndTime = getEndOfDayMillis(compare);
			return propertyValueTime > dayEndTime;
		}

		case DateFilterCondition.IS_BEFORE: {
			if (propertyValue === null) return matchIfNull;

			const propertyValueTime = getTimeMillis(propertyValue);
			const dayStartTime = getStartOfDayMillis(compare);
			return propertyValueTime < dayStartTime;
		}

		case DateFilterCondition.EXISTS:
			return propertyValue !== null;

		case DateFilterCondition.DOES_NOT_EXIST:
			return propertyValue === null;

		default:
			throw new Error(`Date filter condition not supported: ${condition}`);
	}
}
