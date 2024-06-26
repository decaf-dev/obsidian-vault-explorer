import { CheckboxFilterCondition, ContentFilterCondition, DateFilterCondition, DatePropertyFilterValue, FileNameFilterCondition, FilterCondition, FilterRuleType, FolderFilterCondition, ListFilterCondition, NumberFilterCondition, TextFilterCondition } from "src/types";

export const getDisplayNameForFilterRuleType = (type: FilterRuleType) => {
	switch (type) {
		case FilterRuleType.CONTENT:
			return "content";
		case FilterRuleType.FILE_NAME:
			return "file name";
		case FilterRuleType.FOLDER:
			return "folder";
		case FilterRuleType.PROPERTY:
			return "property";
		default:
			return "";
	}
}

export const getDisplayNameForDatePropertyFilterValue = (value: DatePropertyFilterValue) => {
	switch (value) {
		case DatePropertyFilterValue.TODAY:
			return "today";
		case DatePropertyFilterValue.TOMORROW:
			return "tomorrow";
		case DatePropertyFilterValue.YESTERDAY:
			return "yesterday";
		case DatePropertyFilterValue.ONE_WEEK_AGO:
			return "one week ago";
		case DatePropertyFilterValue.ONE_WEEK_FROM_NOW:
			return "one week from now";
		case DatePropertyFilterValue.ONE_MONTH_AGO:
			return "one month ago";
		case DatePropertyFilterValue.ONE_MONTH_FROM_NOW:
			return "one month from now";
		case DatePropertyFilterValue.CUSTOM:
			return "custom";
		default:
			return "";
	}
}

export const getDisplayNameForFilterCondition = (type: FilterCondition) => {
	switch (type) {
		case TextFilterCondition.IS:
		case CheckboxFilterCondition.IS:
		case DateFilterCondition.IS:
		case FileNameFilterCondition.IS:
		case FolderFilterCondition.IS:
			return "is";
		case TextFilterCondition.IS_NOT:
		case CheckboxFilterCondition.IS_NOT:
		case FileNameFilterCondition.IS_NOT:
		case FolderFilterCondition.IS_NOT:
			return "is not";
		case TextFilterCondition.CONTAINS:
		case ListFilterCondition.CONTAINS:
		case FileNameFilterCondition.CONTAINS:
		case ContentFilterCondition.CONTAINS:
			return "contains";
		case TextFilterCondition.DOES_NOT_CONTAIN:
		case ListFilterCondition.DOES_NOT_CONTAIN:
		case FileNameFilterCondition.DOES_NOT_CONTAIN:
		case ContentFilterCondition.DOES_NOT_CONTAIN:
			return "does not contain";
		case TextFilterCondition.STARTS_WITH:
		case FileNameFilterCondition.STARTS_WITH:
			return "starts with";
		case TextFilterCondition.ENDS_WITH:
		case FileNameFilterCondition.ENDS_WITH:
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
		case ContentFilterCondition.IS_EMPTY:
			return "is empty";
		case ContentFilterCondition.IS_NOT_EMPTY:
			return "is not empty";
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
		case DateFilterCondition.IS_ON_OR_AFTER:
			return "is on or after";
		case DateFilterCondition.IS_ON_OR_BEFORE:
			return "is on or before";
		default:
			return "";
	}
};
