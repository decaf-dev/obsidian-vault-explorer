import { Plugin, } from 'obsidian';

import { FRONTMATTER_VIEW } from './constants';
import FrontmatterView from './obsidian/frontmatter-view';

import "./styles.css";
import FrontmatterViewsSettingTabs from './obsidian/frontmatter-views-settings-tab';
import { FrontmatterViewsPluginSettings } from './types';


const DEFAULT_SETTINGS: FrontmatterViewsPluginSettings = {
	favoritePropertyName: "favorite",
	urlPropertyName: "url",
	sourcePropertyName: "source",
}

export default class FrontmatterViewsPlugin extends Plugin {
	settings: FrontmatterViewsPluginSettings;

	async onload() {
		await this.loadSettings();

		this.registerView(
			FRONTMATTER_VIEW,
			(leaf) => new FrontmatterView(leaf, this.app, this.settings)
		);

		this.addRibbonIcon("layout-list", "Frontmatter View", async () => {
			const leaves = this.app.workspace.getLeavesOfType(FRONTMATTER_VIEW);
			if (leaves.length !== 0) {
				const leaf = leaves[0];
				this.app.workspace.revealLeaf(leaf);
			} else {
				this.app.workspace.getLeaf().setViewState({
					type: FRONTMATTER_VIEW,
					active: true,
				});
			}
		});


		this.addSettingTab(new FrontmatterViewsSettingTabs(this.app, this));
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
