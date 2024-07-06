import { Modal } from "obsidian";
import CustomFilterApp from "../svelte/custom-filter-app/index.svelte";
import VaultExplorerPlugin from "src/main";

export default class CustomFilterModal extends Modal {
	component: CustomFilterApp | null;
	plugin: VaultExplorerPlugin;

	constructor(plugin: VaultExplorerPlugin) {
		super(plugin.app);
		this.plugin = plugin;
		this.component = null;
	}

	onOpen(): void {
		const { contentEl } = this;

		this.component = new CustomFilterApp({
			target: contentEl,
		});
	}

	onClose(): void {
		const { contentEl } = this;
		this.component?.$destroy();
		contentEl.empty();
	}
}
