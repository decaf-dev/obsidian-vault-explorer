export interface VaultExplorerPluginSettings_1_0_1 {
	logLevel: string;
	properties: {
		favorite: string;
		url: string;
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
		properties: {
			selectedGroupId: string;
			groups: PropertyFilterGroup[];
		}
	},
	currentView: CurrentView;
	pageSize: number;
	pluginVersion: string | null;
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

//TODO: add more types
export enum DateFilterCondition {
	IS = "is",
	IS_BEFORE = "is-before",
	IS_AFTER = "is-after",
	EXISTS = "exists",
	DOES_NOT_EXIST = "does-not-exist",
}

export type FilterCondition = TextFilterCondition | NumberFilterCondition | DateFilterCondition | CheckboxFilterCondition | ListFilterCondition;

interface BasePropertyFilter {
	id: string;
	propertyName: string;
	operator: FilterOperator;
	type: PropertyFilterType;
	isEnabled: boolean;
	value: string;
}

export enum PropertyFilterType {
	TEXT = "text",
	NUMBER = "number",
	LIST = "list",
	CHECKBOX = "checkbox",
	DATE = "date",
	DATETIME = "datetime",
}

export interface TextPropertyFilter extends BasePropertyFilter {
	type: PropertyFilterType.TEXT;
	condition: TextFilterCondition;
}

export interface NumberPropertyFilter extends BasePropertyFilter {
	type: PropertyFilterType.NUMBER;
	condition: NumberFilterCondition;
}

export interface ListPropertyFilter extends BasePropertyFilter {
	type: PropertyFilterType.LIST
	condition: ListFilterCondition;
}

export interface CheckboxPropertyFilter extends BasePropertyFilter {
	type: PropertyFilterType.CHECKBOX
	condition: CheckboxFilterCondition;
}

export interface DatePropertyFilter extends BasePropertyFilter {
	type: PropertyFilterType.DATE | PropertyFilterType.DATETIME;
	condition: DateFilterCondition;
}

export type PropertyFilter = TextPropertyFilter | NumberPropertyFilter | ListPropertyFilter | CheckboxPropertyFilter | DatePropertyFilter;

export interface PropertyFilterGroup {
	id: string;
	name: string;
	filters: PropertyFilter[];
	isEnabled: boolean;
}

export type CurrentView = "grid" | "list";

export type SortFilter = "file-name-asc" | "file-name-desc" | "modified-asc" | "modified-desc";

export type TimestampFilter = "created-today" | "modified-today" | "created-this-week" | "modified-this-week" | "created-2-weeks" | "modified-2-weeks" | "all";
