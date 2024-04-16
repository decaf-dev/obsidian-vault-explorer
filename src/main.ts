import { Plugin, TFile, } from 'obsidian';

import VaultExplorerView from './obsidian/vault-explorer-view';
import VaultExplorerSettingsTab from './obsidian/vault-explorer-settings-tab';

import { VaultExplorerPluginSettings } from './types';
import { VAULT_EXPLORER_VIEW } from './constants';
import _ from 'lodash';
import EventManager from './event/event-manager';


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
		sort: "file-name-asc",
	},
	currentView: "grid",
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

		this.addRibbonIcon("map", "Open vault explorer", async () => {
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
		this.registerEvent(this.app.vault.on("rename", (file: TFile, oldPath: string) => {
			if (file.extension !== "md") return;
			EventManager.getInstance().emit("rename-file", oldPath, file.path);
		}));

		//Callback if a file is deleted
		//This callback is already debounced by Obsidian
		this.registerEvent(this.app.vault.on("delete", (file: TFile) => {
			if (file.extension !== "md") return;
			EventManager.getInstance().emit("delete-file", file.path);
		}));

		//Callback if a file is created
		//This callback is already debounced by Obsidian
		this.registerEvent(this.app.vault.on("create", (file: TFile) => {
			if (file.extension !== "md") return;
			EventManager.getInstance().emit("create-file", file.path);
		}));

		//Callback if a file is modified
		//This callback is already debounced by Obsidian
		this.registerEvent(this.app.vault.on("modify", (file: TFile) => {
			if (file.extension !== "md") return;
			EventManager.getInstance().emit("modify-file", file.path);
		}));
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
