import { CheckboxFilterCondition, DateFilterCondition, FilterCondition, ListFilterCondition, NumberFilterCondition, TextFilterCondition } from "src/types";

export const getDisplayNameForFilterCondition = (type: FilterCondition) => {
	switch (type) {
		case TextFilterCondition.IS:
		case CheckboxFilterCondition.IS:
		case DateFilterCondition.IS:
			return "Is";
		case TextFilterCondition.IS_NOT:
		case CheckboxFilterCondition.IS_NOT:
			return "Is not";
		case TextFilterCondition.CONTAINS:
		case ListFilterCondition.CONTAINS:
			return "Contains";
		case TextFilterCondition.DOES_NOT_CONTAIN:
		case ListFilterCondition.DOES_NOT_CONTAIN:
			return "Does not contain";
		case TextFilterCondition.STARTS_WITH:
			return "Starts with";
		case TextFilterCondition.ENDS_WITH:
			return "Ends with";
		case TextFilterCondition.IS_EMPTY:
		case NumberFilterCondition.IS_EMPTY:
		case ListFilterCondition.IS_EMPTY:
		case DateFilterCondition.IS_EMPTY:
			return "Is empty";
		case TextFilterCondition.IS_NOT_EMPTY:
		case NumberFilterCondition.IS_NOT_EMPTY:
		case ListFilterCondition.IS_NOT_EMPTY:
		case DateFilterCondition.IS_NOT_EMPTY:
			return "Is not empty";
		case TextFilterCondition.EXISTS:
		case NumberFilterCondition.EXISTS:
		case CheckboxFilterCondition.EXISTS:
		case ListFilterCondition.EXISTS:
		case DateFilterCondition.EXISTS:
			return "Exists";
		case TextFilterCondition.DOES_NOT_EXIST:
		case NumberFilterCondition.DOES_NOT_EXIST:
		case CheckboxFilterCondition.DOES_NOT_EXIST:
		case ListFilterCondition.DOES_NOT_EXIST:
		case DateFilterCondition.DOES_NOT_EXIST:
			return "Does not exist";
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
			return "Is after";
		case DateFilterCondition.IS_BEFORE:
			return "Is before";
		default:
			return "";
	}
};
