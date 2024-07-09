import { LOG_LEVEL_WARN } from "./logger/constants";
import { VaultExplorerPluginSettings, TExplorerView } from "./types";

export const VAULT_EXPLORER_VIEW = "vault-explorer";

export const HOVER_LINK_SOURCE_ID = "vault-explorer-preview";

export const DEFAULT_SETTINGS: VaultExplorerPluginSettings = {
	logLevel: LOG_LEVEL_WARN,
	properties: {
		favorite: "",
		url: "",
		imageUrl: "",
		createdDate: "",
		modifiedDate: "",
		custom1: "",
		custom2: "",
		custom3: "",
	},
	filters: {
		search: {
			isEnabled: true,
			value: "",
		},
		favorites: {
			isEnabled: true,
			value: false,
		},
		timestamp: {
			isEnabled: true,
			value: "all",
		},
		sort: {
			isEnabled: true,
			value: "file-name-asc",
		},
		custom: {
			isEnabled: true,
			selectedGroupId: "",
			groups: [],
		},
	},
	views: {
		dashboard: {
			isEnabled: false,
		},
		grid: {
			isEnabled: true,
		},
		list: {
			isEnabled: true,
		},
		table: {
			isEnabled: false,
		},
		feed: {
			isEnabled: true,
		},
		recommended: {
			isEnabled: false,
		},
		related: {
			isEnabled: false,
		},
	},
	currentView: TExplorerView.GRID,
	titleWrapping: "normal",
	enableClockUpdates: true,
	enableFileIcons: false,
	enableScrollButtons: true,
	filtersWidth: 300,
	pageSize: 50,
	viewOrder: [TExplorerView.GRID, TExplorerView.LIST, TExplorerView.FEED],
	pluginVersion: null,
};
