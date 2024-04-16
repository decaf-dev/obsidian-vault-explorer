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
	},
	currentView: CurrentView;
}

export type CurrentView = "grid" | "list";

export type onSettingsChange = (value: VaultExplorerPluginSettings) => void;
