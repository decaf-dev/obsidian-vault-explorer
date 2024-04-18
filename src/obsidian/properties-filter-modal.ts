import { Modal } from "obsidian";
import Component from "../svelte/properties-filter-app/index.svelte";
import VaultExplorerPlugin from "src/main";

export default class PropertiesFilterModal extends Modal {
	component: Component | null;
	plugin: VaultExplorerPlugin;

	constructor(
		plugin: VaultExplorerPlugin,
	) {
		super(plugin.app);
		this.plugin = plugin;
		this.component = null;
	}

	onOpen(): void {
		const { contentEl } = this;

		this.component = new Component({
			target: contentEl,
		});
	}

	onClose(): void {
		const { contentEl } = this;
		this.component?.$destroy();
		contentEl.empty();
	}
}
