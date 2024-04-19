import { generateUUID } from "./svelte/shared/services/uuid";
import { VaultExplorerPluginSettings } from "./types";

export const VAULT_EXPLORER_VIEW = "vault-explorer";

const uuid = generateUUID();
export const DEFAULT_SETTINGS: VaultExplorerPluginSettings = {
	properties: {
		favorite: "",
		url: "",
		source: "",
		status: "",
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
						position: 0,
						isEnabled: true
					}
				]
		}
	},
	currentView: "grid",
}
