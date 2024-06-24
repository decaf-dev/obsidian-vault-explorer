import { LOG_LEVEL_WARN } from "./logger/constants";
import { generateRandomId } from "./svelte/shared/services/random";
import { VaultExplorerPluginSettings, ViewType } from "./types";

export const VAULT_EXPLORER_VIEW = "vault-explorer";

export const HOVER_LINK_SOURCE_ID = "vault-explorer-preview";

const randomGroupId = generateRandomId();

export const DEFAULT_SETTINGS: VaultExplorerPluginSettings = {
	logLevel: LOG_LEVEL_WARN,
	properties: {
		favorite: "",
		url: "",
		createdDate: "",
		modifiedDate: "",
		custom1: "",
		custom2: "",
		custom3: "",
	},
	filters: {
		search: {
			isEnabled: true,
			value: ""
		},
		favorites: {
			isEnabled: true,
			value: false
		},
		timestamp: {
			isEnabled: true,
			value: "all"
		},
		sort: {
			isEnabled: true,
			value: "file-name-asc",
		},
		custom: {
			isEnabled: true,
			selectedGroupId: randomGroupId,
			groups:
				[
					{
						id: randomGroupId,
						name: "Group 1",
						rules: [],
						isEnabled: true,
						isSticky: false
					}
				]
		}
	},
	views: {
		currentView: ViewType.GRID,
		order: [...Object.values(ViewType)],
		titleWrapping: "normal",
		enableClockUpdates: true
	},
	enableScrollButtons: true,
	pageSize: 50,
	pluginVersion: null
}
