import { Plugin, TAbstractFile, TFile, TFolder } from 'obsidian';

import VaultExplorerView from './obsidian/vault-explorer-view';
import VaultExplorerSettingsTab from './obsidian/vault-explorer-settings-tab';

import { FilterRuleType, VaultExplorerPluginSettings, ViewType } from './types';
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
import { PropertyFilterGroup_1_5_0, PropertyFilter_1_5_0, VaultExplorerPluginSettings_1_5_0 } from './types/types-1.5.0';
import { VaultExplorerPluginSettings_1_6_0 } from './types/types-1.6.0';
import { loadDeviceId } from './svelte/shared/services/device-id-utils';
import License from './svelte/shared/services/license';
import { VaultExplorerPluginSettings_1_8_1 } from './types/types-1.8.1';
import { VaultExplorerPluginSettings_1_9_1 } from './types/types-1.9.1';
import { VaultExplorerPluginSettings_1_12_1 } from './types/types-1.12.1';
import { VaultExplorerPluginSettings_1_13_1 } from './types/types.1.13.1';

export default class VaultExplorerPlugin extends Plugin {
	settings: VaultExplorerPluginSettings = DEFAULT_SETTINGS;
	layoutReady: boolean = false;

	async onload() {
		await this.loadSettings();
		this.setupLogger();

		await loadDeviceId();
		await License.getInstance().verifyLicense();

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
			//For some reason Obsidian will call this event for every file in the vault when the plugin is loaded
			//We need to ignore these events
			if (!this.layoutReady) return;

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

					const updatedGroups: PropertyFilterGroup_1_5_0[] = groups.map(group => {
						const updatedFilters: PropertyFilter_1_5_0[] = group.filters.map(filter => {
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

					const newData: VaultExplorerPluginSettings_1_5_0 = {
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

				if (isVersionLessThan(settingsVersion, "1.6.0")) {
					console.log("Upgrading settings from version 1.5.0 to 1.6.0");
					const typedData = (data as unknown) as VaultExplorerPluginSettings_1_5_0;
					const newData: VaultExplorerPluginSettings_1_6_0 = {
						...typedData,
						properties: {
							...typedData.properties,
							creationDate: "",
							modifiedDate: ""
						}
					}
					data = newData as unknown as Record<string, unknown>;
				}

				if (isVersionLessThan(settingsVersion, "1.6.1")) {
					console.log("Upgrading settings from version 1.6.0 to 1.6.1");
					const typedData = (data as unknown) as VaultExplorerPluginSettings_1_6_0;
					const newData: VaultExplorerPluginSettings_1_8_1 = {
						...typedData,
						properties: {
							...typedData.properties,
							createdDate: "",
							modifiedDate: ""
						}
					}
					data = newData as unknown as Record<string, unknown>;
				}

				if (isVersionLessThan(settingsVersion, "1.9.0")) {
					console.log("Upgrading settings from version 1.8.1 to 1.9.0");
					const typedData = (data as unknown) as VaultExplorerPluginSettings_1_8_1;
					const newData: VaultExplorerPluginSettings_1_9_1 = {
						...typedData,
						filters: {
							...typedData.filters,
							custom: {
								selectedGroupId: typedData.filters.properties.selectedGroupId,
								groups: typedData.filters.properties.groups.map(group => {
									const rules = group.filters.map(filter => {
										return {
											...filter,
											valueData: "",
											type: filter.type as any
										}
									});
									return {
										...group,
										rules
									}
								})
							}
						}
					}
					delete (newData.filters as any).properties;
					for (const group of newData.filters.custom.groups as any) {
						delete group.filters;
					}
					data = newData as unknown as Record<string, unknown>;
				}
			}

			if (isVersionLessThan(settingsVersion, "1.10.0")) {
				console.log("Upgrading settings from version 1.9.1 to 1.10.0");
				const typedData = (data as unknown) as VaultExplorerPluginSettings_1_9_1;
				const newData: VaultExplorerPluginSettings_1_12_1 = {
					...typedData,
					filters: {
						...typedData.filters,
						custom: {
							...typedData.filters.custom,
							groups: typedData.filters.custom.groups.map(group => {
								const rules = group.rules.map(rule => {
									return {
										...rule,
										type: FilterRuleType.PROPERTY as any,
										propertyType: rule.type as any,
									}
								});
								return {
									...group,
									rules
								}
							})
						}
					}
				}
				delete (newData.filters as any).folder;
				delete (newData.filters as any).properties;
				for (const group of newData.filters.custom.groups as any) {
					delete group.filters;
				}
				data = newData as unknown as Record<string, unknown>;
			}

			if (isVersionLessThan(settingsVersion, "1.13.0")) {
				console.log("Upgrading settings from version 1.12.1 to 1.13.0");
				const typedData = (data as unknown) as VaultExplorerPluginSettings_1_12_1;
				const newData: VaultExplorerPluginSettings_1_13_1 = {
					...typedData,
					views: {
						...typedData.views,
						enableClockUpdates: true
					},
					filters: {
						...typedData.filters,
						custom: {
							...typedData.filters.custom,
							groups: typedData.filters.custom.groups.map(group => {
								return {
									...group,
									isSticky: false
								}
							})
						}
					}
				}
				data = newData as unknown as Record<string, unknown>;
			}

			if (isVersionLessThan(settingsVersion, "1.14.0")) {
				console.log("Upgrading settings from version 1.13.1 to 1.14.0");
				const typedData = (data as unknown) as VaultExplorerPluginSettings_1_13_1;
				const newData: VaultExplorerPluginSettings = {
					...typedData,
					filters: {
						...typedData.filters,
						search: {
							isEnabled: true,
							value: typedData.filters.search
						},
						favorites: {
							isEnabled: true,
							value: typedData.filters.onlyFavorites
						},
						timestamp: {
							isEnabled: true,
							value: typedData.filters.timestamp
						},
						sort: {
							isEnabled: true,
							value: typedData.filters.sort
						},
						custom: {
							isEnabled: true,
							...typedData.filters.custom
						},
					}
				}
				delete (newData.filters as any).onlyFavorites;
				data = newData as unknown as Record<string, unknown>;
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
