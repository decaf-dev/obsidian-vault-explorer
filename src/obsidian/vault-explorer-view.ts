import { ItemView, WorkspaceLeaf } from "obsidian";

import { VAULT_EXPLORER_VIEW } from "src/constants";
import VaultExplorerApp from "../svelte/app/index.svelte";
import store from "../svelte/shared/services/store";
import VaultExplorerPlugin from "src/main";

export default class VaultExplorerView extends ItemView {
	component: VaultExplorerApp | null;
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
		this.addAction("settings", "Settings", () => {
			const app = this.plugin.app;
			(app as any).setting.open();
			(app as any).setting.openTabById(this.plugin.manifest.id);
		});

		const containerEl = this.containerEl.children[1];

		store.plugin.set(this.plugin);

		this.component = new VaultExplorerApp({
			target: containerEl,
		});
	}

	async onClose() {
		this.component?.$destroy();
	}
}
