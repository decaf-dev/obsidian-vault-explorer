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
		search: SearchFilter;
		favorites: FavoritesFilter;
		sort: SortFilter;
		timestamp: TimestampFilter;
		custom: CustomFilter;
	},
	views: {
		currentView: ViewType;
		order: ViewType[];
		titleWrapping: WordBreak;
		enableClockUpdates: boolean;
	}
	enableScrollButtons: boolean;
	pageSize: number;
	pluginVersion: string | null;
}

export interface SearchFilter {
	isEnabled: boolean;
	value: string;
}

export interface FavoritesFilter {
	isEnabled: boolean;
	value: boolean;
};

export interface SortFilter {
	isEnabled: boolean;
	value: SortFilterOption;
};

export interface TimestampFilter {
	isEnabled: boolean;
	value: TimestampFilterOption;
}

export interface CustomFilter {
	isEnabled: boolean;
	selectedGroupId: string;
	groups: FilterGroup[];
}

export type TimestampFilterOption = "created-today" | "modified-today" | "created-this-week" | "modified-this-week" | "created-2-weeks" | "modified-2-weeks" | "all";

export type SortFilterOption = "file-name-asc" | "file-name-desc" | "modified-asc" | "modified-desc";

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

export enum ContentFilterCondition {
	CONTAINS = "contains",
	DOES_NOT_CONTAIN = "does-not-contain",
	IS_EMPTY = "is-empty",
	IS_NOT_EMPTY = "is-not-empty",
}

//TODO add is child of and is parent of?
export enum FolderFilterCondition {
	IS = "is",
	IS_NOT = "is-not",
}

export enum FileNameFilterCondition {
	IS = "is",
	IS_NOT = "is-not",
	CONTAINS = "contains",
	DOES_NOT_CONTAIN = "does-not-contain",
	STARTS_WITH = "starts-with",
	ENDS_WITH = "ends-with",
}

export type FilterCondition = TextFilterCondition | NumberFilterCondition | DateFilterCondition | CheckboxFilterCondition | ListFilterCondition | ContentFilterCondition | FolderFilterCondition | FileNameFilterCondition;

//This matches the Obsidian property types
export enum PropertyType {
	TEXT = "text",
	NUMBER = "number",
	LIST = "list",
	CHECKBOX = "checkbox",
	DATE = "date",
	DATETIME = "datetime",
}

export enum FilterRuleType {
	PROPERTY = "property",
	FOLDER = "folder",
	FILE_NAME = "file-name",
	CONTENT = "content",
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
	condition: FilterCondition;
	isEnabled: boolean;
	value: string;
	matchWhenPropertyDNE: boolean;
}

export interface TextPropertyFilterRule extends BaseFilterRule {
	type: FilterRuleType.PROPERTY;
	propertyType: PropertyType.TEXT;
	propertyName: string;
	condition: TextFilterCondition;
}

export interface NumberPropertyFilterRule extends BaseFilterRule {
	type: FilterRuleType.PROPERTY;
	propertyType: PropertyType.NUMBER;
	propertyName: string;
	condition: NumberFilterCondition;
}

export interface ListPropertyFilterRule extends BaseFilterRule {
	type: FilterRuleType.PROPERTY;
	propertyType: PropertyType.LIST;
	propertyName: string;
	condition: ListFilterCondition;
}

export interface CheckboxPropertyFilterRule extends BaseFilterRule {
	type: FilterRuleType.PROPERTY;
	propertyType: PropertyType.CHECKBOX;
	propertyName: string;
	condition: CheckboxFilterCondition;
}

export interface DatePropertyFilterRule extends BaseFilterRule {
	type: FilterRuleType.PROPERTY;
	propertyType: PropertyType.DATE | PropertyType.DATETIME;
	propertyName: string;
	condition: DateFilterCondition;
	valueData: string;
}

export interface FolderFilterRule extends BaseFilterRule {
	type: FilterRuleType.FOLDER;
	condition: FolderFilterCondition;
	includeSubfolders: boolean;
}

export interface FileNameFilterRule extends BaseFilterRule {
	type: FilterRuleType.FILE_NAME;
	condition: FileNameFilterCondition;
}

export interface ContentFilterRule extends BaseFilterRule {
	type: FilterRuleType.CONTENT;
	condition: ContentFilterCondition;
}

export type FilterRule = PropertyFilterRule | FolderFilterRule | FileNameFilterRule | ContentFilterRule;
export type PropertyFilterRule = TextPropertyFilterRule | NumberPropertyFilterRule | ListPropertyFilterRule | CheckboxPropertyFilterRule | DatePropertyFilterRule;

export interface FilterGroup {
	id: string;
	name: string;
	rules: FilterRule[];
	isEnabled: boolean;
	isSticky: boolean;
}
