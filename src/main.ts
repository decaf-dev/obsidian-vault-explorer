import { Plugin, } from 'obsidian';

import VaultExplorerView from './obsidian/vault-explorer-view';
import VaultExplorerSettingsTab from './obsidian/vault-explorer-settings-tab';

import { VaultExplorerPluginSettings } from './types';
import { VAULT_EXPLORER_VIEW } from './constants';


const DEFAULT_SETTINGS: VaultExplorerPluginSettings = {
	favoritePropertyName: "favorite",
	urlPropertyName: "url",
	sourcePropertyName: "source",
	revisionPropertyName: "revision",
	statusPropertyName: "status",
}

export default class VaultExplorerPlugin extends Plugin {
	settings: VaultExplorerPluginSettings;

	async onload() {
		await this.loadSettings();

		this.registerView(
			VAULT_EXPLORER_VIEW,
			(leaf) => new VaultExplorerView(leaf, this.app, this.settings)
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
