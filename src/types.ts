export interface VaultExplorerPluginSettings {
	favoritePropertyName: string;
	urlPropertyName: string;
	sourcePropertyName: string;
	revisionPropertyName: string;
	statusPropertyName: string;
	filters: {
		folder: string;
		search: string;
		onlyFavorites: boolean;
		onlyCreatedToday: boolean;
		onlyModifiedToday: boolean;
		sort: SortFilter;
	},
	currentView: CurrentView;
}

export type CurrentView = "grid" | "list";

export type SortFilter = "file-name-asc" | "file-name-desc" | "modified-asc" | "modified-desc";

export type onSettingsChange = (value: VaultExplorerPluginSettings) => void;
