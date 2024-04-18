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
	},
	currentView: CurrentView;
}

export type CurrentView = "grid" | "list";

export type SortFilter = "file-name-asc" | "file-name-desc" | "modified-asc" | "modified-desc";

export type TimestampFilter = "created-today" | "modified-today" | "created-this-week" | "modified-this-week" | "created-2-weeks" | "modified-2-weeks" | "all";

export type onSettingsChange = (value: VaultExplorerPluginSettings) => void;
