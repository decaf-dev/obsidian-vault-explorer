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

		new Setting(containerEl)
			.setName('Favorite property name')
			.setDesc('The name of the frontmatter property to use to mark a note as a favorite.')
			.addDropdown(dropdown => dropdown.addOptions(getDropdownOptionsForProperties(checkboxProperties))
				.setValue(this.plugin.settings.properties.favorite)
				.onChange(async (value) => {
					this.plugin.settings.properties.favorite = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('URL property name')
			.setDesc('The name of the property used to store the URL of the content.')
			.addDropdown(dropdown => dropdown.addOptions(getDropdownOptionsForProperties(textProperties))
				.setValue(this.plugin.settings.properties.url)
				.onChange(async (value) => {
					this.plugin.settings.properties.url = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Source property name')
			.setDesc('The name of the property used to store the source name of the content.')
			.addDropdown(dropdown => dropdown.addOptions(getDropdownOptionsForProperties(textProperties))
				.setValue(this.plugin.settings.properties.source)
				.onChange(async (value) => {
					this.plugin.settings.properties.source = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Status property name')
			.setDesc('The name of the property used to store the status of the content.')
			.addDropdown(dropdown => dropdown.addOptions(getDropdownOptionsForProperties(textProperties))
				.setValue(this.plugin.settings.properties.status)
				.onChange(async (value) => {
					this.plugin.settings.properties.status = value;
					await this.plugin.saveSettings();
				}));

	}
}
