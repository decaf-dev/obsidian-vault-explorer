import { FilterCondition, TextFilterCondition } from "src/types";

export const getDisplayNameForFilterCondition = (type: FilterCondition) => {
	switch (type) {
		case TextFilterCondition.IS:
			return "is";
		case TextFilterCondition.IS_NOT:
			return "is not";
		case TextFilterCondition.CONTAINS:
			return "contains";
		case TextFilterCondition.DOES_NOT_CONTAIN:
			return "does not contain";
		case TextFilterCondition.STARTS_WITH:
			return "starts with";
		case TextFilterCondition.ENDS_WITH:
			return "ends with";
		case TextFilterCondition.IS_EMPTY:
			return "is empty";
		case TextFilterCondition.IS_NOT_EMPTY:
			return "is not empty";
		default:
			return "";
	}
};
