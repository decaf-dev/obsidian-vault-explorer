export interface VaultExplorerPluginSettings_1_8_1 {
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
		properties: {
			selectedGroupId: string;
			groups: PropertyFilterGroup[];
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

type WordBreak = "normal" | "break-word";

enum ViewType {
	GRID = "grid",
	LIST = "list",
}

type FilterOperator = "and" | "or";

enum TextFilterCondition {
	IS = "is",
	IS_NOT = "is-not",
	CONTAINS = "contains",
	DOES_NOT_CONTAIN = "does-not-contain",
	STARTS_WITH = "starts-with",
	ENDS_WITH = "ends-with",
	EXISTS = "exists",
	DOES_NOT_EXIST = "does-not-exist",
}

enum ListFilterCondition {
	CONTAINS = "contains",
	DOES_NOT_CONTAIN = "does-not-contain",
	EXISTS = "exists",
	DOES_NOT_EXIST = "does-not-exist",
}

enum NumberFilterCondition {
	IS_EQUAL = "is-equal",
	IS_NOT_EQUAL = "is-not-equal",
	IS_GREATER = "is-greater",
	IS_LESS = "is-less",
	IS_GREATER_OR_EQUAL = "is-greater-or-equal",
	IS_LESS_OR_EQUAL = "is-less-or-equal",
	EXISTS = "exists",
	DOES_NOT_EXIST = "does-not-exist",
}

enum CheckboxFilterCondition {
	IS = "is",
	IS_NOT = "is-not",
	EXISTS = "exists",
	DOES_NOT_EXIST = "does-not-exist",
}

enum DateFilterCondition {
	IS = "is",
	IS_BEFORE = "is-before",
	IS_AFTER = "is-after",
	EXISTS = "exists",
	DOES_NOT_EXIST = "does-not-exist",
}

type FilterCondition = TextFilterCondition | NumberFilterCondition | DateFilterCondition | CheckboxFilterCondition | ListFilterCondition;

interface BasePropertyFilter {
	id: string;
	propertyName: string;
	operator: FilterOperator;
	type: PropertyType;
	isEnabled: boolean;
	value: string;
	matchWhenPropertyDNE: boolean;
}

//Matches Obsidian property types
enum PropertyType {
	TEXT = "text",
	NUMBER = "number",
	LIST = "list",
	CHECKBOX = "checkbox",
	DATE = "date",
	DATETIME = "datetime",
}

interface TextPropertyFilter extends BasePropertyFilter {
	type: PropertyType.TEXT;
	condition: TextFilterCondition;
}

interface NumberPropertyFilter extends BasePropertyFilter {
	type: PropertyType.NUMBER;
	condition: NumberFilterCondition;
}

interface ListPropertyFilter extends BasePropertyFilter {
	type: PropertyType.LIST
	condition: ListFilterCondition;
}

interface CheckboxPropertyFilter extends BasePropertyFilter {
	type: PropertyType.CHECKBOX
	condition: CheckboxFilterCondition;
}

interface DatePropertyFilter extends BasePropertyFilter {
	type: PropertyType.DATE | PropertyType.DATETIME;
	condition: DateFilterCondition;
}

type PropertyFilter = TextPropertyFilter | NumberPropertyFilter | ListPropertyFilter | CheckboxPropertyFilter | DatePropertyFilter;

interface PropertyFilterGroup {
	id: string;
	name: string;
	filters: PropertyFilter[];
	isEnabled: boolean;
}

type SortFilter = "file-name-asc" | "file-name-desc" | "modified-asc" | "modified-desc";

type TimestampFilter = "created-today" | "modified-today" | "created-this-week" | "modified-this-week" | "created-2-weeks" | "modified-2-weeks" | "all";
