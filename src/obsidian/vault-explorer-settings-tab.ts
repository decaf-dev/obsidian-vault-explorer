import { App, PluginSettingTab, Setting, SliderComponent } from "obsidian";
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
import { CollapseStyle, CoverImageFit, TExplorerView } from "src/types";
import EventManager from "src/event/event-manager";
import LicenseKeyApp from "../svelte/license-key-app/index.svelte";
import ImageSourceApp from "../svelte/image-source-app/index.svelte";
import { PluginEvent } from "src/event/types";

import "./styles.css";
import { clearSocialMediaImageCache } from "src/svelte/app/services/social-media-image-cache";

export default class VaultExplorerSettingsTab extends PluginSettingTab {
	plugin: VaultExplorerPlugin;

	licenseKeyApp: LicenseKeyApp | null;
	imageSourceApp: ImageSourceApp | null;

	constructor(app: App, plugin: VaultExplorerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
		this.licenseKeyApp = null;
		this.imageSourceApp = null;
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

		new Setting(containerEl)
			.setName("Load tags from body")
			.setDesc(
				"Load tags from the both the tags property and the body of a markdown note."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.loadBodyTags)
					.onChange(async (value) => {
						this.plugin.settings.loadBodyTags = value;
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							PluginEvent.LOAD_BODY_TAGS_SETTING_CHANGE
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

		// new Setting(containerEl).setName("Dashboard view").addToggle((toggle) =>
		// 	toggle
		// 		.setValue(this.plugin.settings.views.dashboard.isEnabled)
		// 		.onChange(async (value) => {
		// 			this.plugin.settings.views.dashboard.isEnabled = value;
		// 			this.updateViewOrder(TExplorerView.DASHBOARD, value);
		// 			await this.plugin.saveSettings();
		// 			EventManager.getInstance().emit(
		// 				PluginEvent.VIEW_TOGGLE_SETTING_CHANGE
		// 			);
		// 		})
		// );

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

		// new Setting(containerEl)
		// 	.setName("Recommended view")
		// 	.addToggle((toggle) =>
		// 		toggle
		// 			.setValue(this.plugin.settings.views.recommended.isEnabled)
		// 			.onChange(async (value) => {
		// 				this.plugin.settings.views.recommended.isEnabled =
		// 					value;
		// 				this.updateViewOrder(TExplorerView.RECOMMENDED, value);
		// 				await this.plugin.saveSettings();
		// 				EventManager.getInstance().emit(
		// 					PluginEvent.VIEW_TOGGLE_SETTING_CHANGE
		// 				);
		// 			})
		// 	);

		// new Setting(containerEl).setName("Related view").addToggle((toggle) =>
		// 	toggle
		// 		.setValue(this.plugin.settings.views.related.isEnabled)
		// 		.onChange(async (value) => {
		// 			this.plugin.settings.views.related.isEnabled = value;
		// 			this.updateViewOrder(TExplorerView.RELATED, value);
		// 			await this.plugin.saveSettings();
		// 			EventManager.getInstance().emit(
		// 				PluginEvent.VIEW_TOGGLE_SETTING_CHANGE
		// 			);
		// 		})
		// );

		new Setting(containerEl).setName("Grid view").setHeading();

		this.imageSourceApp = new ImageSourceApp({
			target: containerEl,
		});

		new Setting(containerEl)
			.setName("Load social media image")
			.setDesc(
				"If a non-image url is found, try to load its social media image"
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

		new Setting(containerEl)
			.setName("Cover image fit")
			.setDesc("Set the default cover image fit")
			.addDropdown((cb) =>
				cb
					.addOptions({
						cover: "Cover",
						contain: "Contain",
					})
					.setValue(this.plugin.settings.views.grid.coverImageFit)
					.onChange(async (value) => {
						this.plugin.settings.views.grid.coverImageFit =
							value as CoverImageFit;
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							PluginEvent.COVER_IMAGE_FIT_SETTING_CHANGE
						);
					})
			);

		new Setting(containerEl).setName("List view").setHeading();

		new Setting(containerEl)
			.setName("Tags")
			.setDesc("Display tags for each list item")
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

		let largeScreenLineClampSlider: SliderComponent | null = null;
		new Setting(containerEl)
			.setName("Large screen line clamp")
			.setDesc(
				"Number of lines to clamp on large screens (>= 1024px) (2-8, default 5)"
			)
			.addExtraButton((button) =>
				button
					.setIcon("reset")
					.setTooltip("Restore default")
					.onClick(async () => {
						this.plugin.settings.views.feed.lineClampLarge = 5;
						largeScreenLineClampSlider?.setValue(5);
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							PluginEvent.FEED_CONTENT_SETTING_CHANGE
						);
					})
			)
			.addSlider((component) => {
				largeScreenLineClampSlider = component;
				return component
					.setValue(this.plugin.settings.views.feed.lineClampLarge)
					.setLimits(2, 8, 1)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.views.feed.lineClampLarge = value;
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							PluginEvent.FEED_CONTENT_SETTING_CHANGE
						);
					});
			});

		let mediumScreenLineClampSlider: SliderComponent | null = null;
		new Setting(containerEl)
			.setName("Medium screen line clamp")
			.setDesc(
				"Number of lines to clamp on medium screens (>= 600px and < 1024px) (2-8, default 3)"
			)
			.addExtraButton((button) =>
				button
					.setIcon("reset")
					.setTooltip("Restore default")
					.onClick(async () => {
						this.plugin.settings.views.feed.lineClampLarge = 3;
						mediumScreenLineClampSlider?.setValue(3);
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							PluginEvent.FEED_CONTENT_SETTING_CHANGE
						);
					})
			)
			.addSlider((component) => {
				mediumScreenLineClampSlider = component;
				return component
					.setValue(this.plugin.settings.views.feed.lineClampMedium)
					.setLimits(2, 8, 1)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.views.feed.lineClampMedium = value;
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							PluginEvent.FEED_CONTENT_SETTING_CHANGE
						);
					});
			});

		let smallScreenLineClampSlider: SliderComponent | null = null;
		new Setting(containerEl)
			.setName("Small screen line clamp")
			.setDesc(
				"Number of lines to clamp on small screens (< 600px) (2-8, default 2)"
			)
			.addExtraButton((button) =>
				button
					.setIcon("reset")
					.setTooltip("Restore default")
					.onClick(async () => {
						this.plugin.settings.views.feed.lineClampLarge = 2;
						smallScreenLineClampSlider?.setValue(2);
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							PluginEvent.FEED_CONTENT_SETTING_CHANGE
						);
					})
			)
			.addSlider((component) => {
				smallScreenLineClampSlider = component;
				return component
					.setValue(this.plugin.settings.views.feed.lineClampSmall)
					.setLimits(2, 8, 1)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.views.feed.lineClampSmall = value;
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							PluginEvent.FEED_CONTENT_SETTING_CHANGE
						);
					});
			});

		new Setting(containerEl).setName("Built-in properties").setHeading();

		new Setting(containerEl)
			.setName("Cover image property")
			.setDesc(
				"Property used to store a cover image. This must be a text property."
			)
			.addDropdown((dropdown) =>
				dropdown
					.addOptions(
						getDropdownOptionsForProperties(textProperties, {
							image: "image",
						})
					)
					.setValue(this.plugin.settings.properties.image)
					.onChange(async (value) => {
						this.plugin.settings.properties.image = value;
						await this.plugin.saveSettings();
						EventManager.getInstance().emit(
							PluginEvent.PROPERTY_SETTING_CHANGE
						);
					})
			);

		new Setting(containerEl)
			.setName("Cover image fit property")
			.setDesc(
				"Property used to store the cover image fit. This must be a text property."
			)
			.addDropdown((dropdown) =>
				dropdown
					.addOptions(
						getDropdownOptionsForProperties(textProperties, {
							"image-fit": "image-fit",
						})
					)
					.setValue(this.plugin.settings.properties.coverImageFit)
					.onChange(async (value) => {
						this.plugin.settings.properties.coverImageFit = value;
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
					.addOptions(
						getDropdownOptionsForProperties(textProperties, {
							url: "url",
						})
					)
					.setValue(this.plugin.settings.properties.url)
					.onChange(async (value) => {
						this.plugin.settings.properties.url = value;
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
			text: "If set, the property will be preferred over the file's creation date.",
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
			text: "If set, the property will be preferred over the file's modification date.",
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

		this.licenseKeyApp = new LicenseKeyApp({
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

		new Setting(containerEl).setName("Data").setHeading();

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

		new Setting(containerEl).setName("Image cache").addButton((button) =>
			button
				.setClass("mod-destructive")
				.setButtonText("Clear cache")
				.onClick(async () => {
					await clearSocialMediaImageCache();
				})
		);
	}

	onClose() {
		this.licenseKeyApp?.$destroy();
		this.imageSourceApp?.$destroy();
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
