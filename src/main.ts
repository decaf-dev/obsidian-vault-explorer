import { Plugin, } from 'obsidian';
import FrontmatterViewsSettingTabs from './obsidian/frontmatter-views-settings-tab';

import "./styles.css";


interface FrontmatterViewsPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: FrontmatterViewsPluginSettings = {
	mySetting: 'default'
}

export default class FrontmatterViewsPlugin extends Plugin {
	settings: FrontmatterViewsPluginSettings;

	async onload() {
		await this.loadSettings();

		//this.addSettingTab(new FrontmatterViewsSettingTabs(this.app, this));
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
