import { Plugin, } from 'obsidian';

import VaultExplorerView from './obsidian/vault-explorer-view';
import VaultExplorerSettingsTab from './obsidian/vault-explorer-settings-tab';

import { VaultExplorerPluginSettings } from './types';
import { VAULT_EXPLORER_VIEW } from './constants';
import _ from 'lodash';


const DEFAULT_SETTINGS: VaultExplorerPluginSettings = {
	favoritePropertyName: "favorite",
	urlPropertyName: "url",
	sourcePropertyName: "source",
	revisionPropertyName: "revision",
	statusPropertyName: "status",
	filters: {
		folder: "",
		search: "",
		onlyFavorites: false,
		onlyCreatedToday: false,
		onlyModifiedToday: false,
	},
}

export default class VaultExplorerPlugin extends Plugin {
	settings: VaultExplorerPluginSettings;

	async onload() {
		await this.loadSettings();

		const debounceSettingsChange = _.debounce(async (value: VaultExplorerPluginSettings) => {
			this.settings = value;
			await this.saveSettings();
			//console.log("Settings saved", this.settings);
		}, 1000);

		this.registerView(
			VAULT_EXPLORER_VIEW,
			(leaf) => new VaultExplorerView(leaf, this.app, this.settings, debounceSettingsChange)
		);

		this.addRibbonIcon("map", "Vault Explorer", async () => {
			const leaves = this.app.workspace.getLeavesOfType(VAULT_EXPLORER_VIEW);
			if (leaves.length !== 0) {
				const leaf = leaves[0];
				this.app.workspace.revealLeaf(leaf);
			} else {
				this.app.workspace.getLeaf().setViewState({
					type: VAULT_EXPLORER_VIEW,
					active: true,
				});
			}
		});


		this.addSettingTab(new VaultExplorerSettingsTab(this.app, this));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
