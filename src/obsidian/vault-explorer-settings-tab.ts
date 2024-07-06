import { App, PluginSettingTab, Setting } from "obsidian";
import VaultExplorerPlugin from "src/main";
import {
	getDropdownOptionsForProperties,
	getObsidianPropertiesByType,
} from "./utils";
import {
	LOG_LEVEL_DEBUG,
	LOG_LEVEL_ERROR,
	LOG_LEVEL_INFO,
	LOG_LEVEL_OFF,
	LOG_LEVEL_TRACE,
	LOG_LEVEL_WARN,
} from "src/logger/constants";
import Logger from "js-logger";
import { stringToLogLevel } from "src/logger";
import { TExplorerView, WordBreak } from "src/types";
import EventManager from "src/event/event-manager";
import Component from "../svelte/license-key-app/index.svelte";

export default class VaultExplorerSettingsTab extends PluginSettingTab {
	plugin: VaultExplorerPlugin;
	component: Component | null;

	constructor(app: App, plugin: VaultExplorerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
		this.component = null;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		const textProperties = getObsidianPropertiesByType(this.app, "text");
		const dateProperties = getObsidianPropertiesByType(this.app, "date");
		const dateTimeProperties = getObsidianPropertiesByType(
			this.app,
			"datetime"
		);
		const checkboxProperties = getObsidianPropertiesByType(
			this.app,
			"checkbox"
		);

		new Setting(containerEl).setName("General").setHeading();

		new Setting(containerEl)
			.setName("Title wrapping")
			.setDesc("Set the wrapping style for the title.")
			.addDropdown((cb) => {
				cb.addOptions({
					normal: "Normal",
					"break-word": "Break Word",
				});
				cb.setValue(this.plugin.settings.titleWrapping).onChange(
					async (value) => {
						this.plugin.settings.titleWrapping = value as WordBreak;
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							"title-wrapping-setting-change"
						);
					}
				);
			});

		new Setting(containerEl)
			.setName("File icons")
			.setDesc("Display an icon next to the file name.")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableFileIcons)
					.onChange(async (value) => {
						this.plugin.settings.enableFileIcons = value;
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							"file-icons-setting-change"
						);
					})
			);

		new Setting(containerEl)
			.setName("Scroll buttons")
			.setDesc("Display scroll buttons for scrollable content.")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableScrollButtons)
					.onChange(async (value) => {
						this.plugin.settings.enableScrollButtons = value;
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							"scroll-buttons-setting-change"
						);
					})
			);

		new Setting(containerEl)
			.setName("Page size")
			.setDesc("Number of items to display per page.")
			.addDropdown((dropdown) =>
				dropdown
					.addOptions({
						"10": "10",
						"25": "25",
						"50": "50",
						"100": "100",
						"250": "250",
						"500": "500",
					})
					.setValue(this.plugin.settings.pageSize.toString())
					.onChange(async (value) => {
						this.plugin.settings.pageSize = parseInt(value);
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							"page-size-setting-change"
						);
					})
			);

		new Setting(containerEl).setName("Filters").setHeading();

		new Setting(containerEl).setName("Search filter").addToggle((toggle) =>
			toggle
				.setValue(this.plugin.settings.filters.search.isEnabled)
				.onChange(async (value) => {
					this.plugin.settings.filters.search.isEnabled = value;
					await this.plugin.saveSettings();
					EventManager.getInstance().emit(
						"filter-toggle-setting-change"
					);
				})
		);

		new Setting(containerEl)
			.setName("Favorites filter")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.filters.favorites.isEnabled)
					.onChange(async (value) => {
						this.plugin.settings.filters.favorites.isEnabled =
							value;
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							"filter-toggle-setting-change"
						);
					})
			);

		new Setting(containerEl)
			.setName("Timestamp filter")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.filters.timestamp.isEnabled)
					.onChange(async (value) => {
						this.plugin.settings.filters.timestamp.isEnabled =
							value;
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							"filter-toggle-setting-change"
						);
					})
			);

		new Setting(containerEl).setName("Sort filter").addToggle((toggle) =>
			toggle
				.setValue(this.plugin.settings.filters.sort.isEnabled)
				.onChange(async (value) => {
					this.plugin.settings.filters.sort.isEnabled = value;
					await this.plugin.saveSettings();
					EventManager.getInstance().emit(
						"filter-toggle-setting-change"
					);
				})
		);

		new Setting(containerEl).setName("Custom filter").addToggle((toggle) =>
			toggle
				.setValue(this.plugin.settings.filters.custom.isEnabled)
				.onChange(async (value) => {
					this.plugin.settings.filters.custom.isEnabled = value;
					await this.plugin.saveSettings();
					EventManager.getInstance().emit(
						"filter-toggle-setting-change"
					);
				})
		);

		new Setting(containerEl).setName("Views").setHeading();

		new Setting(containerEl).setName("Dashboard view").addToggle((toggle) =>
			toggle
				.setDisabled(true) //TODO - Implement dashboard view
				.setValue(this.plugin.settings.views.dashboard.isEnabled)
				.onChange(async (value) => {
					this.plugin.settings.views.dashboard.isEnabled = value;
					this.updateViewOrder(TExplorerView.DASHBOARD, value);
					await this.plugin.saveSettings();
					EventManager.getInstance().emit(
						"view-toggle-setting-change"
					);
				})
		);

		new Setting(containerEl).setName("Grid view").addToggle((toggle) =>
			toggle
				.setValue(this.plugin.settings.views.grid.isEnabled)
				.onChange(async (value) => {
					this.plugin.settings.views.grid.isEnabled = value;
					this.updateViewOrder(TExplorerView.GRID, value);
					await this.plugin.saveSettings();
					EventManager.getInstance().emit(
						"view-toggle-setting-change"
					);
				})
		);

		new Setting(containerEl).setName("List view").addToggle((toggle) =>
			toggle
				.setValue(this.plugin.settings.views.list.isEnabled)
				.onChange(async (value) => {
					this.plugin.settings.views.list.isEnabled = value;
					this.updateViewOrder(TExplorerView.LIST, value);
					await this.plugin.saveSettings();
					EventManager.getInstance().emit(
						"view-toggle-setting-change"
					);
				})
		);

		new Setting(containerEl).setName("Feed view").addToggle((toggle) =>
			toggle
				.setValue(this.plugin.settings.views.feed.isEnabled)
				.onChange(async (value) => {
					this.plugin.settings.views.feed.isEnabled = value;
					this.updateViewOrder(TExplorerView.FEED, value);
					await this.plugin.saveSettings();
					EventManager.getInstance().emit(
						"view-toggle-setting-change"
					);
				})
		);

		new Setting(containerEl).setName("Table view").addToggle((toggle) =>
			toggle
				.setDisabled(true) //TODO implement
				.setTooltip("This view is not yet implemented.")
				.setValue(this.plugin.settings.views.table.isEnabled)
				.onChange(async (value) => {
					this.plugin.settings.views.table.isEnabled = value;
					this.updateViewOrder(TExplorerView.TABLE, value);
					await this.plugin.saveSettings();
					EventManager.getInstance().emit(
						"view-toggle-setting-change"
					);
				})
		);

		new Setting(containerEl)
			.setName("Recommended view")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.views.recommended.isEnabled)
					.setDisabled(true) //TODO implement
					.setTooltip("This view is not yet implemented.")
					.onChange(async (value) => {
						this.plugin.settings.views.recommended.isEnabled =
							value;
						this.updateViewOrder(TExplorerView.RECOMMENDED, value);
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							"view-toggle-setting-change"
						);
					})
			);

		new Setting(containerEl).setName("Related view").addToggle((toggle) =>
			toggle
				.setDisabled(true) //TODO implement
				.setTooltip("This view is not yet implemented.")
				.setValue(this.plugin.settings.views.related.isEnabled)
				.onChange(async (value) => {
					this.plugin.settings.views.related.isEnabled = value;
					this.updateViewOrder(TExplorerView.RELATED, value);
					await this.plugin.saveSettings();
					EventManager.getInstance().emit(
						"view-toggle-setting-change"
					);
				})
		);

		new Setting(containerEl).setName("Built-in properties").setHeading();

		new Setting(containerEl)
			.setName("Favorite property")
			.setDesc(
				"Property used to mark a note as a favorite. This must be a checkbox property."
			)
			.addDropdown((dropdown) =>
				dropdown
					.addOptions(
						getDropdownOptionsForProperties(checkboxProperties)
					)
					.setValue(this.plugin.settings.properties.favorite)
					.onChange(async (value) => {
						this.plugin.settings.properties.favorite = value;
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							"property-setting-change"
						);
					})
			);

		new Setting(containerEl)
			.setName("URL property")
			.setDesc(
				"Property used to store the URL of the content. This must be a text property."
			)
			.addDropdown((dropdown) =>
				dropdown
					.addOptions(getDropdownOptionsForProperties(textProperties))
					.setValue(this.plugin.settings.properties.url)
					.onChange(async (value) => {
						this.plugin.settings.properties.url = value;
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							"property-setting-change"
						);
					})
			);

		const creationDateDesc = new DocumentFragment();
		creationDateDesc.createDiv({
			text: "Property containing the creation date. This must be a date or datetime property.",
		});
		creationDateDesc.createDiv({
			text: "If set to 'Select a property', the file's created at date will be used.",
		});

		new Setting(containerEl)
			.setName("Creation date property")
			.setDesc(creationDateDesc)
			.addDropdown((dropdown) =>
				dropdown
					.addOptions(
						getDropdownOptionsForProperties([
							...dateProperties,
							...dateTimeProperties,
						])
					)
					.setValue(this.plugin.settings.properties.createdDate)
					.onChange(async (value) => {
						this.plugin.settings.properties.createdDate = value;
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							"property-setting-change"
						);
					})
			);

		const modificationDateDesc = new DocumentFragment();
		modificationDateDesc.createDiv({
			text: "Property containing the modification date. This must be a date or datetime property.",
		});
		modificationDateDesc.createDiv({
			text: "If set to 'Select a property', the file's modified at date will be used.",
		});

		new Setting(containerEl)
			.setName("Modification date property")
			.setDesc(modificationDateDesc)
			.addDropdown((dropdown) =>
				dropdown
					.addOptions(
						getDropdownOptionsForProperties([
							...dateProperties,
							...dateTimeProperties,
						])
					)
					.setValue(this.plugin.settings.properties.modifiedDate)
					.onChange(async (value) => {
						this.plugin.settings.properties.modifiedDate = value;
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							"property-setting-change"
						);
					})
			);

		new Setting(containerEl).setName("Custom properties").setHeading();

		new Setting(containerEl)
			.setName("Custom property 1")
			.setDesc("First custom property. This must be a text property.")
			.addDropdown((dropdown) =>
				dropdown
					.addOptions(getDropdownOptionsForProperties(textProperties))
					.setValue(this.plugin.settings.properties.custom1)
					.onChange(async (value) => {
						this.plugin.settings.properties.custom1 = value;
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							"property-setting-change"
						);
					})
			);

		new Setting(containerEl)
			.setName("Custom property 2")
			.setDesc("Second custom property. This must be a text property.")
			.addDropdown((dropdown) =>
				dropdown
					.addOptions(getDropdownOptionsForProperties(textProperties))
					.setValue(this.plugin.settings.properties.custom2)
					.onChange(async (value) => {
						this.plugin.settings.properties.custom2 = value;
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							"property-setting-change"
						);
					})
			);

		new Setting(containerEl)
			.setName("Custom property 3")
			.setDesc("Third custom property. This must be a text property.")
			.addDropdown((dropdown) =>
				dropdown
					.addOptions(getDropdownOptionsForProperties(textProperties))
					.setValue(this.plugin.settings.properties.custom3)
					.onChange(async (value) => {
						this.plugin.settings.properties.custom3 = value;
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							"property-setting-change"
						);
					})
			);

		new Setting(containerEl).setName("Updates").setHeading();

		new Setting(containerEl)
			.setName("Enable clock updates")
			.setDesc(
				"When enabled, time values will update every minute, refreshing the Vault Explorer view. When disabled, time values will only update when the view is first opened."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableClockUpdates)
					.onChange(async (value) => {
						this.plugin.settings.enableClockUpdates = value;
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							"clock-updates-setting-change"
						);
					})
			);

		new Setting(containerEl).setName("Premium").setHeading();

		this.component = new Component({
			target: containerEl,
		});

		new Setting(containerEl).setName("Debugging").setHeading();
		new Setting(containerEl)
			.setName("Log level")
			.setDesc(
				"Set the log level. Please use trace to see all log messages."
			)
			.addDropdown((cb) => {
				cb.addOptions({
					[LOG_LEVEL_OFF]: "Off",
					[LOG_LEVEL_ERROR]: "Error",
					[LOG_LEVEL_WARN]: "Warn",
					[LOG_LEVEL_INFO]: "Info",
					[LOG_LEVEL_DEBUG]: "Debug",
					[LOG_LEVEL_TRACE]: "Trace",
				});
				cb.setValue(this.plugin.settings.logLevel).onChange(
					async (value) => {
						this.plugin.settings.logLevel = value;
						await this.plugin.saveSettings();
						Logger.setLevel(stringToLogLevel(value));
					}
				);
			});
	}

	onClose() {
		this.component?.$destroy();
	}

	private updateViewOrder(view: TExplorerView, value: boolean) {
		if (value) {
			this.plugin.settings.viewOrder.push(view);

			//If the user turned off all views, set the current view to the first view that is turned on
			if (this.plugin.settings.currentView == null)
				this.plugin.settings.currentView = view;
		} else {
			const filtered = this.plugin.settings.viewOrder.filter(
				(v) => v !== view
			);
			this.plugin.settings.viewOrder = filtered;

			//If the user turned off the current view, set the current view to the first view
			//that is turned on, otherwise set it to null
			if (filtered.length > 0) {
				this.plugin.settings.currentView = filtered[0];
			} else {
				this.plugin.settings.currentView = null;
			}
		}
	}
}
