import { Plugin, TAbstractFile, TFile, TFolder } from 'obsidian';

import VaultExplorerView from './obsidian/vault-explorer-view';
import VaultExplorerSettingsTab from './obsidian/vault-explorer-settings-tab';

import { VaultExplorerPluginSettings } from './types';
import { DEFAULT_SETTINGS, HOVER_LINK_SOURCE_ID, VAULT_EXPLORER_VIEW } from './constants';
import _ from 'lodash';
import EventManager from './event/event-manager';
import { preformMigrations } from './migrations';
import Logger from 'js-logger';
import { formatMessageForLogger, stringToLogLevel } from './logger';
import { moveFocus } from './focus-utils';
import { loadDeviceId } from './svelte/shared/services/device-id-utils';
import License from './svelte/shared/services/license';

export default class VaultExplorerPlugin extends Plugin {
	settings: VaultExplorerPluginSettings = DEFAULT_SETTINGS;
	layoutReady: boolean = false;

	async onload() {
		await this.loadSettings();
		this.setupLogger();

		this.registerView(
			VAULT_EXPLORER_VIEW,
			(leaf) => new VaultExplorerView(leaf, this)
		);

		this.addRibbonIcon("compass", "Open vault explorer", async () => {
			this.openVaultExplorerView();
		});

		this.addCommand({
			id: "open",
			name: "Open vault explorer view",
			callback: async () => {
				this.openVaultExplorerView();
			},
		});

		this.registerEvents();
		this.registerHoverLinkSource(HOVER_LINK_SOURCE_ID, { display: this.manifest.name, defaultMod: true });
		this.addSettingTab(new VaultExplorerSettingsTab(this.app, this));

		this.app.workspace.onLayoutReady(() => {
			this.layoutReady = true;
		});

		await loadDeviceId();
		await License.getInstance().verifyLicense();

	}

	private registerEvents() {
		//Callback if the file is renamed or moved
		//This callback is already debounced by Obsidian
		this.registerEvent(this.app.vault.on("rename", (file: TAbstractFile, oldPath: string) => {
			if (file instanceof TFolder) {
				EventManager.getInstance().emit("folder-rename", oldPath, file);
			} else if (file instanceof TFile) {
				EventManager.getInstance().emit("file-rename", oldPath, file);
			}
		}));

		//Callback if a file is deleted
		//This callback is already debounced by Obsidian
		this.registerEvent(this.app.vault.on("delete", (file: TAbstractFile) => {
			if (file instanceof TFolder) {
				EventManager.getInstance().emit("folder-delete", file.path);
			} else
				if (file instanceof TFile) {
					EventManager.getInstance().emit("file-delete", file.path);
				}
		}));

		//Callback if a file is created
		//This callback is already debounced by Obsidian
		this.registerEvent(this.app.vault.on("create", (file: TAbstractFile) => {
			//For some reason Obsidian will call this event for every file in the vault when the plugin is loaded
			//We need to ignore these events
			if (!this.layoutReady) return;

			if (file instanceof TFolder) {
				EventManager.getInstance().emit("folder-create", file);
			} else if (file instanceof TFile) {
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
			EventManager.getInstance().emit("metadata-change", file);
		}));

		this.registerDomEvent(document, "keydown", (event) => {
			if (event.key === "ArrowLeft") {
				moveFocus("previous");
			} else if (event.key === "ArrowRight") {
				moveFocus("next");
			}
		});

	}

	onunload() {

	}

	async loadSettings() {
		const loadedData: Record<string, unknown> | null = await this.loadData();

		let currentData: Record<string, unknown> = {};

		if (loadedData !== null) {
			//This will be undefined if the settings are from a version before 0.3.0
			const loadedVersion = loadedData["pluginVersion"] as string ?? null;
			if (loadedVersion !== null) {
				const newData = preformMigrations(loadedVersion, loadedData);
				currentData = newData;
			}
		}

		//Apply default settings
		this.settings = Object.assign({}, DEFAULT_SETTINGS, currentData);
		//Update the plugin version to the current version
		this.settings.pluginVersion = this.manifest.version;
		await this.saveSettings();
	}

	async saveSettings() {
		Logger.trace({ fileName: "main.ts", functionName: "saveSettings", message: "called" });
		Logger.debug({ fileName: "main.ts", functionName: "saveSettings", message: "saving settings" }, this.settings);
		await this.saveData(this.settings);
	}

	private openVaultExplorerView() {
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
	}

	private setupLogger() {
		Logger.useDefaults();
		Logger.setHandler(function (messages, context) {
			const { message, data } = formatMessageForLogger(...messages);
			if (context.level === Logger.WARN) {
				console.warn(message);
				if (data) {
					console.warn(data);
				}
			} else if (context.level === Logger.ERROR) {
				console.error(message);
				if (data) {
					console.error(data);
				}
			} else {
				console.log(message);
				if (data) {
					console.log(data);
				}
			}
		});

		const logLevel = stringToLogLevel(this.settings.logLevel);
		Logger.setLevel(logLevel);
	}
}
