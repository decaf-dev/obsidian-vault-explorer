/** @see {isVaultExplorerPluginSettings} ts-auto-guard:type-guard */
export interface VaultExplorerPluginSettings {
	properties: {
		url: string;
		image: string;
		coverImageFit: string;
		createdDate: string;
		modifiedDate: string;
		custom1: string;
		custom2: string;
		custom3: string;
	};
	filters: {
		search: TSearchFilter;
		sort: TSortFilter;
		custom: TCustomFilter;
	};
	views: {
		grid: TGridView;
		list: TListView;
		feed: TFeedView;
		table: TTableView;
	};
	confirmBeforeDelete: boolean;
	titleWrapping: WordBreak;
	enableClockUpdates: boolean;
	enableFileIcons: boolean;
	loadBodyTags: boolean;
	currentView: TExplorerView | null;
	pageSize: number;
	shouldCollapseFilters: boolean;
	configDir: string;
	pluginVersion: string | null;
	logLevel: string;
}

interface BaseView {
	isEnabled: boolean;
	order: number;
}

export interface TTableView extends BaseView {}

export interface TListView extends BaseView {
	showTags: boolean;
}

export interface TGridView extends BaseView {
	coverImageSources: CoverImageSource[];
	coverImageFit: CoverImageFit;
	loadSocialMediaImage: boolean;
}

export interface CoverImageSource {
	type: CoverImageSourceType;
	isEnabled: boolean;
}

export type CoverImageFit = "cover" | "contain";

export type CoverImageSourceType =
	| "image-property"
	| "url-property"
	| "frontmatter"
	| "body";

export type CollapseStyle = "no-new-lines" | "no-extra-new-lines";

export interface TFeedView extends BaseView {
	collapseStyle: CollapseStyle;
	removeH1: boolean;
	lineClampSmall: number;
	lineClampMedium: number;
	lineClampLarge: number;
}

interface BaseFilter {
	isEnabled: boolean;
}

export interface TSearchFilter extends BaseFilter {
	value: string;
}

export interface TSortFilter extends BaseFilter {
	value: SortFilterOption;
}

export interface TCustomFilter extends BaseFilter {
	selectedGroupId: string;
	groups: TFilterGroup[];
}

export type SortFilterOption =
	| "file-name-asc"
	| "file-name-desc"
	| "modified-asc"
	| "modified-desc"
	| "created-asc"
	| "created-desc"
	| "random";

export type WordBreak = "normal" | "break-word";

export enum TExplorerView {
	GRID = "grid",
	LIST = "list",
	FEED = "feed",
	TABLE = "table",
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

export type FilterCondition =
	| TextFilterCondition
	| NumberFilterCondition
	| DateFilterCondition
	| CheckboxFilterCondition
	| ListFilterCondition
	| ContentFilterCondition
	| FolderFilterCondition
	| FileNameFilterCondition;

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
	CUSTOM = "custom",
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

export type TFilterRule =
	| PropertyFilterRule
	| FolderFilterRule
	| FileNameFilterRule
	| ContentFilterRule;

export type PropertyFilterRule =
	| TextPropertyFilterRule
	| NumberPropertyFilterRule
	| ListPropertyFilterRule
	| CheckboxPropertyFilterRule
	| DatePropertyFilterRule;

export interface TFilterGroup {
	id: string;
	name: string;
	rules: TFilterRule[];
	isEnabled: boolean;
	isSticky: boolean;
}
