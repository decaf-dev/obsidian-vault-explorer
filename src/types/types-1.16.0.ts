export interface VaultExplorerPluginSettings_1_16_0 {
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

export { ViewType as ViewType_1_16_0 }

interface SearchFilter {
	isEnabled: boolean;
	value: string;
}

interface FavoritesFilter {
	isEnabled: boolean;
	value: boolean;
};

interface SortFilter {
	isEnabled: boolean;
	value: SortFilterOption;
};

interface TimestampFilter {
	isEnabled: boolean;
	value: TimestampFilterOption;
}

interface CustomFilter {
	isEnabled: boolean;
	selectedGroupId: string;
	groups: FilterGroup[];
}

type TimestampFilterOption = "created-today" | "modified-today" | "created-this-week" | "modified-this-week" | "created-2-weeks" | "modified-2-weeks" | "all";

type SortFilterOption = "file-name-asc" | "file-name-desc" | "modified-asc" | "modified-desc";

type WordBreak = "normal" | "break-word";

enum ViewType {
	GRID = "grid",
	LIST = "list",
	FEED = "feed"
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

//TODO: add is between
enum DateFilterCondition {
	IS = "is",
	IS_BEFORE = "is-before",
	IS_AFTER = "is-after",
	IS_ON_OR_BEFORE = "is-on-or-before",
	IS_ON_OR_AFTER = "is-on-or-after",
	EXISTS = "exists",
	DOES_NOT_EXIST = "does-not-exist",
}

enum ContentFilterCondition {
	CONTAINS = "contains",
	DOES_NOT_CONTAIN = "does-not-contain",
	IS_EMPTY = "is-empty",
	IS_NOT_EMPTY = "is-not-empty",
}

//TODO add is child of and is parent of?
enum FolderFilterCondition {
	IS = "is",
	IS_NOT = "is-not",
}

enum FileNameFilterCondition {
	IS = "is",
	IS_NOT = "is-not",
	CONTAINS = "contains",
	DOES_NOT_CONTAIN = "does-not-contain",
	STARTS_WITH = "starts-with",
	ENDS_WITH = "ends-with",
}

type FilterCondition = TextFilterCondition | NumberFilterCondition | DateFilterCondition | CheckboxFilterCondition | ListFilterCondition | ContentFilterCondition | FolderFilterCondition | FileNameFilterCondition;

//This matches the Obsidian property types
enum PropertyType {
	TEXT = "text",
	NUMBER = "number",
	LIST = "list",
	CHECKBOX = "checkbox",
	DATE = "date",
	DATETIME = "datetime",
}

enum FilterRuleType {
	PROPERTY = "property",
	FOLDER = "folder",
	FILE_NAME = "file-name",
	CONTENT = "content",
}

enum DatePropertyFilterValue {
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

interface TextPropertyFilterRule extends BaseFilterRule {
	type: FilterRuleType.PROPERTY;
	propertyType: PropertyType.TEXT;
	propertyName: string;
	condition: TextFilterCondition;
}

interface NumberPropertyFilterRule extends BaseFilterRule {
	type: FilterRuleType.PROPERTY;
	propertyType: PropertyType.NUMBER;
	propertyName: string;
	condition: NumberFilterCondition;
}

interface ListPropertyFilterRule extends BaseFilterRule {
	type: FilterRuleType.PROPERTY;
	propertyType: PropertyType.LIST;
	propertyName: string;
	condition: ListFilterCondition;
}

interface CheckboxPropertyFilterRule extends BaseFilterRule {
	type: FilterRuleType.PROPERTY;
	propertyType: PropertyType.CHECKBOX;
	propertyName: string;
	condition: CheckboxFilterCondition;
}

interface DatePropertyFilterRule extends BaseFilterRule {
	type: FilterRuleType.PROPERTY;
	propertyType: PropertyType.DATE | PropertyType.DATETIME;
	propertyName: string;
	condition: DateFilterCondition;
	valueData: string;
}

interface FolderFilterRule extends BaseFilterRule {
	type: FilterRuleType.FOLDER;
	condition: FolderFilterCondition;
	includeSubfolders: boolean;
}

interface FileNameFilterRule extends BaseFilterRule {
	type: FilterRuleType.FILE_NAME;
	condition: FileNameFilterCondition;
}

interface ContentFilterRule extends BaseFilterRule {
	type: FilterRuleType.CONTENT;
	condition: ContentFilterCondition;
}

type FilterRule = PropertyFilterRule | FolderFilterRule | FileNameFilterRule | ContentFilterRule;
type PropertyFilterRule = TextPropertyFilterRule | NumberPropertyFilterRule | ListPropertyFilterRule | CheckboxPropertyFilterRule | DatePropertyFilterRule;

interface FilterGroup {
	id: string;
	name: string;
	rules: FilterRule[];
	isEnabled: boolean;
	isSticky: boolean;
}
