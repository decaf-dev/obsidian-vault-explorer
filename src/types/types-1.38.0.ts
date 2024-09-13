export interface VaultExplorerPluginSettings_1_38_0 {
	properties: {
		favorite: string;
		url: string;
		image: string;
		createdDate: string;
		modifiedDate: string;
		custom1: string;
		custom2: string;
		custom3: string;
	};
	filters: {
		search: TSearchFilter;
		favorites: TFavoritesFilter;
		sort: TSortFilter;
		timestamp: TTimestampFilter;
		custom: TCustomFilter;
	};
	views: {
		dashboard: TDashboardView;
		grid: TGridView;
		list: TListView;
		table: TTableView;
		feed: TFeedView;
		recommended: TRecommendedView;
		related: TRelatedView;
	};
	titleWrapping: WordBreak;
	enableClockUpdates: boolean;
	enableFileIcons: boolean;
	loadBodyTags: boolean;
	currentView: TExplorerView | null;
	pageSize: number;
	filterGroupsWidth: string;
	shouldWrapFilterGroups: boolean;
	viewOrder: TExplorerView[];
	configDir: string;
	pluginVersion: string | null;
	logLevel: string;
}

interface BaseView {
	isEnabled: boolean;
}

interface TTableView extends BaseView {}

interface TListView extends BaseView {
	showTags: boolean;
}

interface TGridView extends BaseView {
	coverImageSources: CoverImageSource[];
	loadSocialMediaImage: boolean;
}

interface CoverImageSource {
	type: CoverImageSourceType;
	isEnabled: boolean;
}

type CoverImageSourceType =
	| "image-property"
	| "url-property"
	| "frontmatter"
	| "body";

interface TDashboardView extends BaseView {}

type CollapseStyle = "no-new-lines" | "no-extra-new-lines";

interface TFeedView extends BaseView {
	collapseStyle: CollapseStyle;
	removeH1: boolean;
	lineClampSmall: number;
	lineClampMedium: number;
	lineClampLarge: number;
}

interface TRecommendedView extends BaseView {}

interface TRelatedView extends BaseView {}

interface BaseFilter {
	isEnabled: boolean;
}

interface TSearchFilter extends BaseFilter {
	value: string;
}

interface TFavoritesFilter extends BaseFilter {
	value: boolean;
}

interface TSortFilter extends BaseFilter {
	value: SortFilterOption;
}

interface TTimestampFilter extends BaseFilter {
	value: TimestampFilterOption;
}

interface TCustomFilter extends BaseFilter {
	selectedGroupId: string;
	groups: TFilterGroup[];
}

type TimestampFilterOption =
	| "created-today"
	| "modified-today"
	| "created-this-week"
	| "modified-this-week"
	| "created-2-weeks"
	| "modified-2-weeks"
	| "all";

type SortFilterOption =
	| "file-name-asc"
	| "file-name-desc"
	| "modified-asc"
	| "modified-desc"
	| "random";

type WordBreak = "normal" | "break-word";

enum TExplorerView {
	DASHBOARD = "dashboard",
	GRID = "grid",
	LIST = "list",
	FEED = "feed",
	TABLE = "table",
	RECOMMENDED = "recommended",
	RELATED = "related",
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

type FilterCondition =
	| TextFilterCondition
	| NumberFilterCondition
	| DateFilterCondition
	| CheckboxFilterCondition
	| ListFilterCondition
	| ContentFilterCondition
	| FolderFilterCondition
	| FileNameFilterCondition;

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

type TFilterRule =
	| PropertyFilterRule
	| FolderFilterRule
	| FileNameFilterRule
	| ContentFilterRule;

type PropertyFilterRule =
	| TextPropertyFilterRule
	| NumberPropertyFilterRule
	| ListPropertyFilterRule
	| CheckboxPropertyFilterRule
	| DatePropertyFilterRule;

interface TFilterGroup {
	id: string;
	name: string;
	rules: TFilterRule[];
	isEnabled: boolean;
	isSticky: boolean;
}
