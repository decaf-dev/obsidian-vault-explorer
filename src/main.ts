import { Plugin, TAbstractFile, TFile, } from 'obsidian';

import VaultExplorerView from './obsidian/vault-explorer-view';
import VaultExplorerSettingsTab from './obsidian/vault-explorer-settings-tab';

import { VaultExplorerPluginSettings } from './types';
import { DEFAULT_SETTINGS, VAULT_EXPLORER_VIEW } from './constants';
import _ from 'lodash';
import EventManager from './event/event-manager';

export default class VaultExplorerPlugin extends Plugin {
	settings: VaultExplorerPluginSettings = DEFAULT_SETTINGS;
	debounceSaveSettings: () => void = () => { };

	async onload() {
		this.debounceSaveSettings = _.debounce(this.saveSettings, 1000);
		await this.loadSettings();

		this.registerView(
			VAULT_EXPLORER_VIEW,
			(leaf) => new VaultExplorerView(leaf, this)
		);

		this.addRibbonIcon("compass", "Open vault explorer", async () => {
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

		this.registerEvents();

		this.addSettingTab(new VaultExplorerSettingsTab(this.app, this));
	}

	private registerEvents() {
		//Callback if the file is renamed or moved
		//This callback is already debounced by Obsidian
		this.registerEvent(this.app.vault.on("rename", (file: TAbstractFile, oldPath: string) => {
			if (file instanceof TFile) {
				if (file.extension !== "md") return;
				EventManager.getInstance().emit("rename-file", oldPath, file.path);
			}
		}));

		//Callback if a file is deleted
		//This callback is already debounced by Obsidian
		this.registerEvent(this.app.vault.on("delete", (file: TAbstractFile) => {
			if (file instanceof TFile) {
				if (file.extension !== "md") return;
				EventManager.getInstance().emit("delete-file", file.path);
			}
		}));

		//Callback if a file is created
		//This callback is already debounced by Obsidian
		this.registerEvent(this.app.vault.on("create", (file: TAbstractFile) => {
			if (file instanceof TFile) {
				if (file.extension !== "md") return;
				EventManager.getInstance().emit("create-file", file.path);
			}
		}));

		//Callback if a file is modified
		//This callback is already debounced by Obsidian
		this.registerEvent(this.app.vault.on("modify", (file: TAbstractFile) => {
			if (file instanceof TFile) {
				if (file.extension !== "md") return;
				EventManager.getInstance().emit("modify-file", file.path);
			}
		}));

		//Callback if the frontmatter is changed
		//This callback is already debounced by Obsidian
		this.registerEvent(this.app.metadataCache.on("changed", (file) => {
			if (file.extension !== "md") return;
			EventManager.getInstance().emit("metadata-change", file.path);
		}));
	}

	onunload() {

	}

	async loadSettings() {
		const data = await this.loadData();
		this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
	}

	async saveSettings() {
		console.log("Saving settings");
		await this.saveData(this.settings);
	}

	private handleSettingsChange = async (value: VaultExplorerPluginSettings) => {
		this.settings = value;
		this.debounceSaveSettings();
	}
}
