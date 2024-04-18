export interface VaultExplorerPluginSettings {
	properties: {
		favorite: string;
		url: string;
		source: string;
		status: string;
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
}

export interface PropertyFilterGroup {
	id: string;
	name: string;
	filters: PropertyFilter[];
	position: number;
	isEnabled: boolean;
}

type PropertyFilter = TextPropertyFilter;

interface BasePropertyFilter {
	id: string;
	propertyName: string;
	operator: FilterOperator;
	isEnabled: boolean;
}

export interface TextPropertyFilter extends BasePropertyFilter {
	condition: TextFilterCondition;
	value: string;
}

export type FilterCondition = TextFilterCondition;

export enum TextFilterCondition {
	IS = "is",
	IS_NOT = "is-not",
	CONTAINS = "contains",
	DOES_NOT_CONTAIN = "does-not-contain",
	STARTS_WITH = "starts-with",
	ENDS_WITH = "ends-with",
	IS_EMPTY = "is-empty",
	IS_NOT_EMPTY = "is-not-empty",
}

export type FilterOperator = "and" | "or";

export type CurrentView = "grid" | "list";

export type SortFilter = "file-name-asc" | "file-name-desc" | "modified-asc" | "modified-desc";

export type TimestampFilter = "created-today" | "modified-today" | "created-this-week" | "modified-this-week" | "created-2-weeks" | "modified-2-weeks" | "all";

export type onSettingsChange = (value: VaultExplorerPluginSettings) => void;

export type getCurrentSettings = () => VaultExplorerPluginSettings;
