import { VaultExplorerPluginSettings } from "./types";

export const VAULT_EXPLORER_VIEW = "vault-explorer";

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
			selectedGroupId: "0",
			groups:
				[
					{
						id: "0",
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
