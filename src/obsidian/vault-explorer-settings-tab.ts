import { App, PluginSettingTab, Setting } from "obsidian";
import VaultExplorerPlugin from "src/main";
import { getAllObsidianProperties, getDropdownOptionsForProperties, getObsidianPropertiesByType } from "./utils";

export default class VaultExplorerSettingsTab extends PluginSettingTab {
	plugin: VaultExplorerPlugin;

	constructor(app: App, plugin: VaultExplorerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		const textProperties = getObsidianPropertiesByType(this.app, "text");
		const checkboxProperties = getObsidianPropertiesByType(this.app, "checkbox");

		new Setting(containerEl).setName("Views").setHeading();

		new Setting(containerEl).setName("Page size").setDesc("The number of items to display per page.").addDropdown(dropdown => dropdown
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
			}));

		new Setting(containerEl).setName("Default properties").setHeading();

		new Setting(containerEl)
			.setName('Favorite property')
			.setDesc('The property used to mark a note as a favorite. This must be a checkbox property.')
			.addDropdown(dropdown => dropdown.addOptions(getDropdownOptionsForProperties(checkboxProperties))
				.setValue(this.plugin.settings.properties.favorite)
				.onChange(async (value) => {
					this.plugin.settings.properties.favorite = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('URL property')
			.setDesc('The property used to store the URL of the content. This must be a text property.')
			.addDropdown(dropdown => dropdown.addOptions(getDropdownOptionsForProperties(textProperties))
				.setValue(this.plugin.settings.properties.url)
				.onChange(async (value) => {
					this.plugin.settings.properties.url = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl).setName("Custom properties").setHeading();

		new Setting(containerEl)
			.setName('Custom property 1')
			.setDesc('The first custom property. This must be a text property.')
			.addDropdown(dropdown => dropdown.addOptions(getDropdownOptionsForProperties(textProperties))
				.setValue(this.plugin.settings.properties.custom1)
				.onChange(async (value) => {
					this.plugin.settings.properties.custom1 = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Custom property 2')
			.setDesc('The second custom property. This must be a text property.')
			.addDropdown(dropdown => dropdown.addOptions(getDropdownOptionsForProperties(textProperties))
				.setValue(this.plugin.settings.properties.custom2)
				.onChange(async (value) => {
					this.plugin.settings.properties.custom2 = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Custom property 3')
			.setDesc('The third custom property. This must be a text property.')
			.addDropdown(dropdown => dropdown.addOptions(getDropdownOptionsForProperties(textProperties))
				.setValue(this.plugin.settings.properties.custom3)
				.onChange(async (value) => {
					this.plugin.settings.properties.custom3 = value;
					await this.plugin.saveSettings();
				}));

	}
}
