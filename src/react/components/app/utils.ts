import { FilterCondition, TextFilterCondition } from "src/types";

export const matchesPropertyFilter = (
	condition: FilterCondition,
	propertyValue: string,
	compare: string,
	shouldMatchIfNull: boolean
): boolean => {
	propertyValue = propertyValue.toLowerCase().trim();
	compare = compare.toLowerCase().trim();

	switch (condition) {
		case TextFilterCondition.IS:
			if (compare === "") return shouldMatchIfNull;
			return propertyValue === compare;
		case TextFilterCondition.IS_NOT:
			if (compare === "") return shouldMatchIfNull;
			return propertyValue !== compare;
		case TextFilterCondition.CONTAINS:
			if (compare === "") return shouldMatchIfNull;
			return propertyValue.includes(compare);
		case TextFilterCondition.DOES_NOT_CONTAIN:
			if (compare === "") return shouldMatchIfNull;
			return !propertyValue.includes(compare);
		case TextFilterCondition.STARTS_WITH:
			if (compare === "") return shouldMatchIfNull;
			return propertyValue.startsWith(compare);
		case TextFilterCondition.ENDS_WITH:
			if (compare === "") return shouldMatchIfNull;
			return propertyValue.endsWith(compare);
		case TextFilterCondition.IS_EMPTY:
			return propertyValue === "";
		case TextFilterCondition.IS_NOT_EMPTY:
			return propertyValue !== "";
		default:
			throw new Error("Filter condition not yet supported");
	}
};
