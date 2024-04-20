import { Plugin, TAbstractFile, TFile, TFolder, } from 'obsidian';

import VaultExplorerView from './obsidian/vault-explorer-view';
import VaultExplorerSettingsTab from './obsidian/vault-explorer-settings-tab';

import { VaultExplorerPluginSettings } from './types';
import { DEFAULT_SETTINGS, VAULT_EXPLORER_VIEW } from './constants';
import _ from 'lodash';
import EventManager from './event/event-manager';

export default class VaultExplorerPlugin extends Plugin {
	settings: VaultExplorerPluginSettings = DEFAULT_SETTINGS;

	async onload() {
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
			const newPath = file.path;
			if (file instanceof TFolder) {
				EventManager.getInstance().emit("folder-rename", oldPath, newPath);
			} else if (file instanceof TFile) {
				if (file.extension !== "md") return;
				EventManager.getInstance().emit("file-rename", oldPath, newPath);
			}
		}));

		//Callback if a file is deleted
		//This callback is already debounced by Obsidian
		this.registerEvent(this.app.vault.on("delete", (file: TAbstractFile) => {
			if (file instanceof TFolder) {
				EventManager.getInstance().emit("folder-delete", file.path);
			} else
				if (file instanceof TFile) {
					if (file.extension !== "md") return;
					EventManager.getInstance().emit("file-delete", file.path);
				}
		}));

		//Callback if a file is created
		//This callback is already debounced by Obsidian
		this.registerEvent(this.app.vault.on("create", (file: TAbstractFile) => {
			if (file instanceof TFolder) {
				EventManager.getInstance().emit("folder-create", file);
			} else if (file instanceof TFile) {
				if (file.extension !== "md") return;
				EventManager.getInstance().emit("file-create", file);
			}
		}));

		//Callback if a file is modified
		//This callback is already debounced by Obsidian
		this.registerEvent(this.app.vault.on("modify", (file: TAbstractFile) => {
			if (file instanceof TFile) {
				if (file.extension !== "md") return;
				EventManager.getInstance().emit("file-modify", file);
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
		await this.saveData(this.settings);
	}
}
