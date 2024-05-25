import { generateUUID } from "./svelte/shared/services/uuid";
import { VaultExplorerPluginSettings } from "./types";

export const VAULT_EXPLORER_VIEW = "vault-explorer";

const uuid = generateUUID();
export const DEFAULT_SETTINGS: VaultExplorerPluginSettings = {
	properties: {
		favorite: "",
		url: "",
		custom1: "",
		custom2: "",
		custom3: ""
	},
	filters: {
		folder: "/",
		search: "",
		onlyFavorites: false,
		timestamp: "all",
		sort: "file-name-asc",
		properties: {
			selectedGroupId: uuid,
			groups:
				[
					{
						id: uuid,
						name: "Group 1",
						filters: [],
						isEnabled: true
					}
				]
		}
	},
	currentView: "grid",
	pageSize: 50,
	pluginVersion: null
}
