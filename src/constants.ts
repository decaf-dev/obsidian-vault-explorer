import { LOG_LEVEL_WARN } from "./logger/constants";
import { VaultExplorerPluginSettings, TExplorerView } from "./types";

export const VAULT_EXPLORER_VIEW = "vault-explorer";

export const HOVER_LINK_SOURCE_ID = "vault-explorer-preview";

export const DEFAULT_SETTINGS: VaultExplorerPluginSettings = {
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
			loadSocialMediaImage: true,
		},
		list: {
			isEnabled: true,
			showTags: true,
		},
		table: {
			isEnabled: false,
		},
		feed: {
			isEnabled: true,
			removeH1: true,
			collapseStyle: "no-new-lines",
			lineClampLarge: 5,
			lineClampMedium: 3,
			lineClampSmall: 2,
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
	fileInteractionStyle: "content",
	filterGroupsWidth: "100%",
	filterGroupsWrapping: "nowrap",
	pageSize: 25,
	viewOrder: [TExplorerView.GRID, TExplorerView.LIST, TExplorerView.FEED],
	configDir: ".vaultexplorer",
	pluginVersion: null,
	logLevel: LOG_LEVEL_WARN,
};
