import { App, PluginSettingTab, Setting } from "obsidian";
import FrontmatterViewsPlugin from "src/main";

export default class FrontmatterViewsSettingTabs extends PluginSettingTab {
	plugin: FrontmatterViewsPlugin;

	constructor(app: App, plugin: FrontmatterViewsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Favorite property name')
			.setDesc('The name of the frontmatter property used to mark a note as a favorite.')
			.addText(text => text
				.setValue(this.plugin.settings.favoritePropertyName)
				.onChange(async (value) => {
					this.plugin.settings.favoritePropertyName = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('URL property name')
			.setDesc('The name of the property used to store the URL of the content.')
			.addText(text => text
				.setValue(this.plugin.settings.urlPropertyName)
				.onChange(async (value) => {
					this.plugin.settings.urlPropertyName = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Source property name')
			.setDesc('The name of the property used to store the source name of the content.')
			.addText(text => text
				.setValue(this.plugin.settings.sourcePropertyName)
				.onChange(async (value) => {
					this.plugin.settings.sourcePropertyName = value;
					await this.plugin.saveSettings();
				}));

	}
}
