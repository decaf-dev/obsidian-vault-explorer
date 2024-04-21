import { FilterCondition, TextFilterCondition } from "src/types";

export const getDisplayNameForFilterCondition = (type: FilterCondition) => {
	switch (type) {
		case TextFilterCondition.IS:
			return "Is";
		case TextFilterCondition.IS_NOT:
			return "Is not";
		case TextFilterCondition.CONTAINS:
			return "Contains";
		case TextFilterCondition.DOES_NOT_CONTAIN:
			return "Does not contain";
		case TextFilterCondition.STARTS_WITH:
			return "Starts with";
		case TextFilterCondition.ENDS_WITH:
			return "Ends with";
		case TextFilterCondition.IS_EMPTY:
			return "Is empty";
		case TextFilterCondition.IS_NOT_EMPTY:
			return "Is not empty";
		default:
			return "";
	}
};
