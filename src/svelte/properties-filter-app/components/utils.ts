import { CheckboxFilterCondition, DateFilterCondition, FilterCondition, ListFilterCondition, NumberFilterCondition, TextFilterCondition } from "src/types";

export const getDisplayNameForFilterCondition = (type: FilterCondition) => {
	switch (type) {
		case TextFilterCondition.IS:
		case CheckboxFilterCondition.IS:
		case DateFilterCondition.IS:
			return "is";
		case TextFilterCondition.IS_NOT:
		case CheckboxFilterCondition.IS_NOT:
			return "is not";
		case TextFilterCondition.CONTAINS:
		case ListFilterCondition.CONTAINS:
			return "contains";
		case TextFilterCondition.DOES_NOT_CONTAIN:
		case ListFilterCondition.DOES_NOT_CONTAIN:
			return "does not contain";
		case TextFilterCondition.STARTS_WITH:
			return "starts with";
		case TextFilterCondition.ENDS_WITH:
			return "ends with";
		case TextFilterCondition.EXISTS:
		case NumberFilterCondition.EXISTS:
		case CheckboxFilterCondition.EXISTS:
		case ListFilterCondition.EXISTS:
		case DateFilterCondition.EXISTS:
			return "exists";
		case TextFilterCondition.DOES_NOT_EXIST:
		case NumberFilterCondition.DOES_NOT_EXIST:
		case CheckboxFilterCondition.DOES_NOT_EXIST:
		case ListFilterCondition.DOES_NOT_EXIST:
		case DateFilterCondition.DOES_NOT_EXIST:
			return "does not exist";
		case NumberFilterCondition.IS_EQUAL:
			return "=";
		case NumberFilterCondition.IS_NOT_EQUAL:
			return "!=";
		case NumberFilterCondition.IS_GREATER:
			return ">";
		case NumberFilterCondition.IS_GREATER_OR_EQUAL:
			return ">=";
		case NumberFilterCondition.IS_LESS:
			return "<";
		case NumberFilterCondition.IS_LESS_OR_EQUAL:
			return "<=";
		case DateFilterCondition.IS_AFTER:
			return "is after";
		case DateFilterCondition.IS_BEFORE:
			return "is before";
		default:
			return "";
	}
};
