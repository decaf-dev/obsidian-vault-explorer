import { Plugin, TAbstractFile, TFile, TFolder } from 'obsidian';

import VaultExplorerView from './obsidian/vault-explorer-view';
import VaultExplorerSettingsTab from './obsidian/vault-explorer-settings-tab';

import { PropertyFilter, PropertyFilterGroup, VaultExplorerPluginSettings, ViewType } from './types';
import { DEFAULT_SETTINGS, HOVER_LINK_SOURCE_ID, VAULT_EXPLORER_VIEW } from './constants';
import _ from 'lodash';
import EventManager from './event/event-manager';
import { isVersionLessThan } from './utils';
import { VaultExplorerPluginSettings_0_3_3 } from './types/types-0.3.0';
import { VaultExplorerPluginSettings_0_5_5 } from './types/types-0.5.5';
import Logger from 'js-logger';
import { formatMessageForLogger, stringToLogLevel } from './logger';
import { LOG_LEVEL_WARN } from './logger/constants';
import { VaultExplorerPluginSettings_1_0_1 } from './types/types-1.0.1';
import { moveFocus } from './focus-utils';
import { VaultExplorerPluginSettings_1_2_0 } from './types/types-1.2.0';
import { VaultExplorerPluginSettings_1_2_1 } from './types/types-1.2.1';

export default class VaultExplorerPlugin extends Plugin {
	settings: VaultExplorerPluginSettings = DEFAULT_SETTINGS;

	async onload() {
		await this.loadSettings();

		//Setup logger
		Logger.useDefaults();
		Logger.setHandler(function (messages) {
			const { message, data } = formatMessageForLogger(...messages);
			console.log(message);
			if (data) {
				console.log(data);
			}
		});

		const logLevel = stringToLogLevel(this.settings.logLevel);
		Logger.setLevel(logLevel);


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
		this.registerHoverLinkSource(HOVER_LINK_SOURCE_ID, { display: this.manifest.name, defaultMod: true });
		this.addSettingTab(new VaultExplorerSettingsTab(this.app, this));
	}

	private registerEvents() {
		//Callback if the file is renamed or moved
		//This callback is already debounced by Obsidian
		this.registerEvent(this.app.vault.on("rename", (file: TAbstractFile, oldPath: string) => {
			if (file instanceof TFolder) {
				EventManager.getInstance().emit("folder-rename", oldPath, file);
			} else if (file instanceof TFile) {
				if (file.extension !== "md") return;
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
		let data: Record<string, unknown> | null = await this.loadData();

		if (data !== null) {
			//This will be null if the settings are from a version before 0.3.0
			const settingsVersion = (data["pluginVersion"] as string) ?? null;
			if (settingsVersion !== null) {
				if (isVersionLessThan(settingsVersion, "0.4.0")) {
					console.log("Upgrading settings from version 0.3.3 to 0.4.0");
					const typedData = (data as unknown) as VaultExplorerPluginSettings_0_3_3;
					const newData: VaultExplorerPluginSettings_0_5_5 = {
						...typedData,
						filters: {
							...typedData.filters,
							properties: {
								...typedData.filters.properties,
								groups: []
							}
						}
					}
					data = newData as unknown as Record<string, unknown>;
				}

				if (isVersionLessThan(settingsVersion, "1.0.0")) {
					console.log("Upgrading settings from version 0.5.5 to 1.0.0");
					const typedData = (data as unknown) as VaultExplorerPluginSettings_0_5_5;
					const newData: VaultExplorerPluginSettings_1_0_1 = {
						...typedData,
						logLevel: LOG_LEVEL_WARN,
						filters: {
							...typedData.filters,
							properties: {
								...typedData.filters.properties,
								groups: typedData.filters.properties.groups.map(group => {
									const { id, name, filters, isEnabled } = group;
									return {
										id,
										name,
										filters,
										isEnabled
									}
								})
							}
						}
					}
					data = newData as unknown as Record<string, unknown>;
				}

				if (isVersionLessThan(settingsVersion, "1.1.0")) {
					console.log("Upgrading settings from version 1.0.1 to 1.1.0");
					const typedData = (data as unknown) as VaultExplorerPluginSettings_1_0_1;
					const newData: VaultExplorerPluginSettings_1_2_0 = {
						...typedData,
						views: {
							currentView: typedData.currentView as unknown as ViewType,
							order: [ViewType.GRID, ViewType.LIST]
						}
					}
					data = newData as unknown as Record<string, unknown>;
				}

				if (isVersionLessThan(settingsVersion, "1.2.1")) {
					console.log("Upgrading settings from version 1.2.0 to 1.2.1");
					const typedData = (data as unknown) as VaultExplorerPluginSettings_1_2_0;
					const newData: VaultExplorerPluginSettings_1_2_1 = {
						...typedData,
						views: {
							...typedData.views,
							titleWrapping: "normal"
						}
					}
					data = newData as unknown as Record<string, unknown>;
				}

				if (isVersionLessThan(settingsVersion, "1.3.0")) {
					console.log("Upgrading settings from version 1.2.1 to 1.3.0");
					const typedData = (data as unknown) as VaultExplorerPluginSettings_1_2_1;
					const groups = typedData.filters.properties.groups;

					const updatedGroups: PropertyFilterGroup[] = groups.map(group => {
						const updatedFilters: PropertyFilter[] = group.filters.map(filter => {
							return {
								...filter,
								type: filter.type as any,
								matchWhenPropertyDNE: false
							}
						});
						return {
							...group,
							filters: updatedFilters
						}
					});

					const newData: VaultExplorerPluginSettings = {
						...typedData,
						filters: {
							...typedData.filters,
							properties: {
								...typedData.filters.properties,
								groups: updatedGroups,
							}
						}
					}
					data = newData as unknown as Record<string, unknown>;
				}
			}
		}

		//Apply default settings. This will make it so we don't need to do migrations for just adding new settings
		this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
		//Update the plugin version to the current version
		this.settings.pluginVersion = this.manifest.version;
		await this.saveSettings();
	}

	async saveSettings() {
		Logger.trace({ fileName: "main.ts", functionName: "saveSettings", message: "called" });
		Logger.debug({ fileName: "main.ts", functionName: "saveSettings", message: "Saving settings" }, this.settings);
		await this.saveData(this.settings);
	}
}
