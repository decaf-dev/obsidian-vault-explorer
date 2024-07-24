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
import {
	CollapseStyle,
	CoverImageSource,
	FileInteractionStyle,
	FlexWrap,
	TExplorerView,
} from "src/types";
import EventManager from "src/event/event-manager";
import LicenseKeyApp from "../svelte/license-key-app/index.svelte";
import { PluginEvent } from "src/event/types";

import "./styles.css";

export default class VaultExplorerSettingsTab extends PluginSettingTab {
	plugin: VaultExplorerPlugin;
	component: LicenseKeyApp | null;

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
			.setName("File interaction")
			.setDesc("Set how a file should be interacted with.")
			.addDropdown((cb) => {
				cb.addOptions({
					content: "Click on content",
					title: "Click on title",
				});
				cb.setValue(this.plugin.settings.fileInteractionStyle).onChange(
					async (value) => {
						this.plugin.settings.fileInteractionStyle =
							value as FileInteractionStyle;
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							PluginEvent.FILE_INTERACTION_STYLE
						);
					}
				);
			});

		// new Setting(containerEl)
		// 	.setName("Title wrapping")
		// 	.setDesc("Set the wrapping style for the title.")
		// 	.addDropdown((cb) => {
		// 		cb.addOptions({
		// 			normal: "Normal",
		// 			"break-word": "Break Word",
		// 		});
		// 		cb.setValue(this.plugin.settings.titleWrapping).onChange(
		// 			async (value) => {
		// 				this.plugin.settings.titleWrapping = value as WordBreak;
		// 				await this.plugin.saveSettings();
		// 				EventManager.getInstance().emit(
		// 					PluginEvent.TITLE_WRAPPING_SETTING_CHANGE
		// 				);
		// 			}
		// 		);
		// 	});

		new Setting(containerEl)
			.setName("Filter groups wrapping")
			.setDesc("Set the wrapping style for filter groups.")
			.addDropdown((cb) => {
				cb.addOptions({
					wrap: "Wrap",
					nowrap: "No Wrap",
				});
				cb.setValue(this.plugin.settings.filterGroupsWrapping).onChange(
					async (value) => {
						this.plugin.settings.filterGroupsWrapping =
							value as FlexWrap;
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							PluginEvent.FILTER_GROUPS_WRAPPING_SETTING_CHANGE
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
							PluginEvent.FILE_ICONS_SETTING_CHANGE
						);
					})
			);

		// TODO remove?
		// new Setting(containerEl)
		// 	.setName("Scroll buttons")
		// 	.setDesc("Display scroll buttons for scrollable content.")
		// 	.addToggle((toggle) =>
		// 		toggle
		// 			.setValue(this.plugin.settings.enableScrollButtons)
		// 			.onChange(async (value) => {
		// 				this.plugin.settings.enableScrollButtons = value;
		// 				await this.plugin.saveSettings();
		// 				EventManager.getInstance().emit(
		// 					"scroll-buttons-setting-change"
		// 				);
		// 			})
		// 	);

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
							PluginEvent.PAGE_SIZE_SETTING_CHANGE
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
						PluginEvent.FILTER_TOGGLE_SETTING_CHANGE
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
							PluginEvent.FILTER_TOGGLE_SETTING_CHANGE
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
							PluginEvent.FILTER_TOGGLE_SETTING_CHANGE
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
						PluginEvent.FILTER_TOGGLE_SETTING_CHANGE
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
						PluginEvent.FILTER_TOGGLE_SETTING_CHANGE
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
						PluginEvent.VIEW_TOGGLE_SETTING_CHANGE
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
						PluginEvent.VIEW_TOGGLE_SETTING_CHANGE
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
						PluginEvent.VIEW_TOGGLE_SETTING_CHANGE
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
						PluginEvent.VIEW_TOGGLE_SETTING_CHANGE
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
						PluginEvent.VIEW_TOGGLE_SETTING_CHANGE
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
							PluginEvent.VIEW_TOGGLE_SETTING_CHANGE
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
						PluginEvent.VIEW_TOGGLE_SETTING_CHANGE
					);
				})
		);

		new Setting(containerEl).setName("Grid view").setHeading();

		new Setting(containerEl)
			.setName("Cover image source")
			.setDesc(
				"Set the source for the cover image. The first image found will be used."
			)
			.addDropdown((cb) =>
				cb
					.addOptions({
						"frontmatter-and-body": "Frontmatter and body",
						"frontmatter-only": "Frontmatter only",
					})
					.setValue(this.plugin.settings.views.grid.coverImageSource)
					.onChange(async (value) => {
						this.plugin.settings.views.grid.coverImageSource =
							value as CoverImageSource;
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							PluginEvent.COVER_IMAGE_SOURCE_SETTING_CHANGE
						);
					})
			);

		new Setting(containerEl)
			.setName("Load social media image")
			.setDesc(
				"If a url is found, load the social media image for the url"
			)
			.addToggle((toggle) =>
				toggle
					.setValue(
						this.plugin.settings.views.grid.loadSocialMediaImage
					)
					.onChange(async (value) => {
						this.plugin.settings.views.grid.loadSocialMediaImage =
							value;
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							PluginEvent.LOAD_SOCIAL_MEDIA_IMAGE_SETTING_CHANGE
						);
					})
			);

		new Setting(containerEl).setName("List view").setHeading();

		new Setting(containerEl)
			.setName("Tags")
			.setDesc("Display tags for vault file")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.views.list.showTags)
					.onChange(async (value) => {
						this.plugin.settings.views.list.showTags = value;
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							PluginEvent.SHOW_TAGS_SETTING_CHANGE
						);
					})
			);

		new Setting(containerEl).setName("Feed view").setHeading();

		new Setting(containerEl)
			.setName("Remove H1")
			.setDesc("Remove level 1 headers from feed content")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.views.feed.removeH1)
					.onChange(async (value) => {
						this.plugin.settings.views.feed.removeH1 = value;
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							PluginEvent.FEED_CONTENT_SETTING_CHANGE
						);
					})
			);

		new Setting(containerEl)
			.setName("Collapse style")
			.setDesc("Set the collapse style for feed content")
			.addDropdown((cb) =>
				cb
					.addOptions({
						"no-new-lines": "No new lines",
						"no-extra-new-lines": "No extra new lines",
					})
					.setValue(this.plugin.settings.views.feed.collapseStyle)
					.onChange(async (value) => {
						this.plugin.settings.views.feed.collapseStyle =
							value as CollapseStyle;
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							PluginEvent.FEED_CONTENT_SETTING_CHANGE
						);
					})
			);

		new Setting(containerEl)
			.setName("Large screen line clamp")
			.setDesc(
				"Number of lines to clamp on large screens (>= 1024px). (2-8, default 5)"
			)
			.addSlider((component) =>
				component
					.setValue(this.plugin.settings.views.feed.lineClampLarge)
					.setLimits(2, 8, 1)
					.onChange(async (value) => {
						this.plugin.settings.views.feed.lineClampLarge = value;
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							PluginEvent.FEED_CONTENT_SETTING_CHANGE
						);
					})
			);

		new Setting(containerEl)
			.setName("Medium screen line clamp")
			.setDesc(
				"Number of lines to clamp on medium screens (>= 600px and < 1024px). (2-8, default 3)"
			)
			.addSlider((component) =>
				component
					.setValue(this.plugin.settings.views.feed.lineClampMedium)
					.setLimits(2, 8, 1)
					.onChange(async (value) => {
						this.plugin.settings.views.feed.lineClampMedium = value;
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							PluginEvent.FEED_CONTENT_SETTING_CHANGE
						);
					})
			);

		new Setting(containerEl)
			.setName("Small screen line clamp")
			.setDesc(
				"Number of lines to clamp on small screens (< 600px). (2-8, default 2)"
			)
			.addSlider((component) =>
				component
					.setValue(this.plugin.settings.views.feed.lineClampSmall)
					.setLimits(2, 8, 1)
					.onChange(async (value) => {
						this.plugin.settings.views.feed.lineClampSmall = value;
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							PluginEvent.FEED_CONTENT_SETTING_CHANGE
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
							PluginEvent.PROPERTY_SETTING_CHANGE
						);
					})
			);

		new Setting(containerEl)
			.setName("URL property")
			.setDesc(
				"Property used to store a URL. This must be a text property."
			)
			.addDropdown((dropdown) =>
				dropdown
					.addOptions(getDropdownOptionsForProperties(textProperties))
					.setValue(this.plugin.settings.properties.url)
					.onChange(async (value) => {
						this.plugin.settings.properties.url = value;
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							PluginEvent.PROPERTY_SETTING_CHANGE
						);
					})
			);

		new Setting(containerEl)
			.setName("Image URL property")
			.setDesc(
				"Property used to store an image url. This must be a text property."
			)
			.addDropdown((dropdown) =>
				dropdown
					.addOptions(getDropdownOptionsForProperties(textProperties))
					.setValue(this.plugin.settings.properties.imageUrl)
					.onChange(async (value) => {
						this.plugin.settings.properties.imageUrl = value;
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							PluginEvent.PROPERTY_SETTING_CHANGE
						);
					})
			);

		const creationDateDesc = new DocumentFragment();
		creationDateDesc.createDiv({
			text: "Property used to store a creation date. This must be a date or datetime property.",
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
							PluginEvent.PROPERTY_SETTING_CHANGE
						);
					})
			);

		const modificationDateDesc = new DocumentFragment();
		modificationDateDesc.createDiv({
			text: "Property used to store a modification date. This must be a date or datetime property.",
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
							PluginEvent.PROPERTY_SETTING_CHANGE
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
							PluginEvent.PROPERTY_SETTING_CHANGE
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
							PluginEvent.PROPERTY_SETTING_CHANGE
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
							PluginEvent.PROPERTY_SETTING_CHANGE
						);
					})
			);

		new Setting(containerEl).setName("Updates").setHeading();

		new Setting(containerEl)
			.setName("Clock updates")
			.setDesc(
				"Update time values every minute. This will refresh the Vault Explorer view"
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableClockUpdates)
					.onChange(async (value) => {
						this.plugin.settings.enableClockUpdates = value;
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							PluginEvent.CLOCK_UPDATES_SETTING_CHANGE
						);
					})
			);

		new Setting(containerEl).setName("Premium").setHeading();

		this.component = new LicenseKeyApp({
			target: containerEl,
		});

		new Setting(containerEl).setName("Storage").setHeading();

		const configFolderDesc = new DocumentFragment();
		configFolderDesc.createDiv({
			text: "Set the plugin configuration folder.",
		});
		configFolderDesc.createDiv({
			text: "Restart Obsidian after changing this setting.",
			cls: "mod-warning",
		});

		new Setting(containerEl)
			.setName("Config folder")
			.setDesc(configFolderDesc)
			.addText((component) =>
				component
					.setValue(this.plugin.settings.configDir)
					.onChange(async (value) => {
						this.plugin.settings.configDir = value;
						await this.plugin.saveSettings();
					})
			);

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
