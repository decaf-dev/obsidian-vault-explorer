export interface VaultExplorerPluginSettings {
	logLevel: string;
	properties: {
		favorite: string;
		url: string;
		createdDate: string;
		modifiedDate: string;
		custom1: string;
		custom2: string;
		custom3: string;
	},
	filters: {
		folder: string;
		search: string;
		onlyFavorites: boolean;
		sort: SortFilter;
		timestamp: TimestampFilter;
		custom: {
			selectedGroupId: string;
			groups: FilterGroup[];
		}
	},
	views: {
		currentView: ViewType;
		order: ViewType[];
		titleWrapping: WordBreak;
	}
	pageSize: number;
	pluginVersion: string | null;
}

export type WordBreak = "normal" | "break-word";

export enum ViewType {
	GRID = "grid",
	LIST = "list",
}

export type FilterOperator = "and" | "or";

export enum TextFilterCondition {
	IS = "is",
	IS_NOT = "is-not",
	CONTAINS = "contains",
	DOES_NOT_CONTAIN = "does-not-contain",
	STARTS_WITH = "starts-with",
	ENDS_WITH = "ends-with",
	EXISTS = "exists",
	DOES_NOT_EXIST = "does-not-exist",
}

export enum ListFilterCondition {
	CONTAINS = "contains",
	DOES_NOT_CONTAIN = "does-not-contain",
	EXISTS = "exists",
	DOES_NOT_EXIST = "does-not-exist",
}

export enum NumberFilterCondition {
	IS_EQUAL = "is-equal",
	IS_NOT_EQUAL = "is-not-equal",
	IS_GREATER = "is-greater",
	IS_LESS = "is-less",
	IS_GREATER_OR_EQUAL = "is-greater-or-equal",
	IS_LESS_OR_EQUAL = "is-less-or-equal",
	EXISTS = "exists",
	DOES_NOT_EXIST = "does-not-exist",
}

export enum CheckboxFilterCondition {
	IS = "is",
	IS_NOT = "is-not",
	EXISTS = "exists",
	DOES_NOT_EXIST = "does-not-exist",
}

//TODO: add is between
export enum DateFilterCondition {
	IS = "is",
	IS_BEFORE = "is-before",
	IS_AFTER = "is-after",
	IS_ON_OR_BEFORE = "is-on-or-before",
	IS_ON_OR_AFTER = "is-on-or-after",
	EXISTS = "exists",
	DOES_NOT_EXIST = "does-not-exist",
}

export type FilterCondition = TextFilterCondition | NumberFilterCondition | DateFilterCondition | CheckboxFilterCondition | ListFilterCondition;

export enum FilterRuleType {
	TEXT = "text",
	NUMBER = "number",
	LIST = "list",
	CHECKBOX = "checkbox",
	DATE = "date",
	DATETIME = "datetime",
}

export enum DatePropertyFilterValue {
	TODAY = "today",
	TOMORROW = "tomorrow",
	YESTERDAY = "yesterday",
	ONE_WEEK_FROM_NOW = "one-week-from-now",
	ONE_WEEK_AGO = "one-week-ago",
	ONE_MONTH_FROM_NOW = "one-month-from-now",
	ONE_MONTH_AGO = "one-month-ago",
	CUSTOM = "custom"
}

interface BaseFilterRule {
	id: string;
	operator: FilterOperator;
	type: FilterRuleType;
	isEnabled: boolean;
	value: string;
	matchWhenPropertyDNE: boolean;
}

export interface TextPropertyFilter extends BaseFilterRule {
	type: FilterRuleType.TEXT;
	propertyName: string;
	condition: TextFilterCondition;
}

export interface NumberPropertyFilter extends BaseFilterRule {
	type: FilterRuleType.NUMBER;
	propertyName: string;
	condition: NumberFilterCondition;
}

export interface ListPropertyFilter extends BaseFilterRule {
	type: FilterRuleType.LIST
	propertyName: string;
	condition: ListFilterCondition;
}

export interface CheckboxPropertyFilter extends BaseFilterRule {
	type: FilterRuleType.CHECKBOX;
	propertyName: string;
	condition: CheckboxFilterCondition;
}

export interface DatePropertyFilter extends BaseFilterRule {
	type: FilterRuleType.DATE | FilterRuleType.DATETIME;
	propertyName: string;
	condition: DateFilterCondition;
	valueData: string;
}

export type FilterRule = TextPropertyFilter | NumberPropertyFilter | ListPropertyFilter | CheckboxPropertyFilter | DatePropertyFilter;

export interface FilterGroup {
	id: string;
	name: string;
	rules: FilterRule[];
	isEnabled: boolean;
}

export type SortFilter = "file-name-asc" | "file-name-desc" | "modified-asc" | "modified-desc";

export type TimestampFilter = "created-today" | "modified-today" | "created-this-week" | "modified-this-week" | "created-2-weeks" | "modified-2-weeks" | "all";
