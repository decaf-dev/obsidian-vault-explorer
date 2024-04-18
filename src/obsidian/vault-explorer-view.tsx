import { ItemView, WorkspaceLeaf } from "obsidian";

import { VAULT_EXPLORER_VIEW } from "src/constants";
import Component from "../svelte/app/index.svelte";
import store from "../svelte/app/store";
import VaultExplorerPlugin from "src/main";

export default class VaultExplorerView extends ItemView {
	component: Component | null;
	plugin: VaultExplorerPlugin;

	constructor(leaf: WorkspaceLeaf, plugin: VaultExplorerPlugin) {
		super(leaf);
		this.component = null;
		this.plugin = plugin;
	}

	getIcon(): string {
		return "compass";
	}

	getViewType(): string {
		return VAULT_EXPLORER_VIEW;
	}
	getDisplayText(): string {
		return "Vault Explorer";
	}

	async onOpen() {
		const containerEl = this.containerEl.children[1];

		store.plugin.set(this.plugin);
		this.component = new Component({
			target: containerEl,
		});
	}

	async onClose() {
		this.component?.$destroy();
	}
}
