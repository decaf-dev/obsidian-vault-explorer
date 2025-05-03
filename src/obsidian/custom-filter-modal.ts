import { Modal } from "obsidian";
import VaultExplorerPlugin from "src/main";
import { mount, unmount } from "svelte";
import CustomFilterApp from "../svelte/custom-filter-app/index.svelte";

export default class CustomFilterModal extends Modal {
	customFilterApp: ReturnType<typeof mount> | null;
	plugin: VaultExplorerPlugin;

	constructor(plugin: VaultExplorerPlugin) {
		super(plugin.app);
		this.plugin = plugin;
		this.customFilterApp = null;
	}

	onOpen(): void {
		const { contentEl } = this;

		this.customFilterApp = mount(CustomFilterApp, {
			target: contentEl
		});
	}

	onClose(): void {
		const { contentEl } = this;

		if (this.customFilterApp) {
			unmount(this.customFilterApp);
		}

		contentEl.empty();
	}
}
