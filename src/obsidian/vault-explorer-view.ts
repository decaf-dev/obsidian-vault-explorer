import { ItemView, WorkspaceLeaf } from "obsidian";

import { VAULT_EXPLORER_VIEW } from "src/constants";
import VaultExplorerApp from "../svelte/app/index.svelte";
import VaultExplorerPlugin from "src/main";
import EventManager from "src/event/event-manager";
import { PluginEvent } from "src/event/types";

export default class VaultExplorerView extends ItemView {
	component: VaultExplorerApp | null;
	plugin: VaultExplorerPlugin;

	constructor(leaf: WorkspaceLeaf, plugin: VaultExplorerPlugin) {
		super(leaf);
		this.component = null;
		this.plugin = plugin;
		this.navigation = true;
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

		this.addAction("chevrons-down-up", "Collapse filters", () => {
			EventManager.getInstance().emit(
				PluginEvent.COLLAPSE_FILTERS_CHANGE
			);
		});

		const containerEl = this.containerEl.children[1];

		this.component = new VaultExplorerApp({
			target: containerEl,
		});
	}

	async onClose() {
		this.component?.$destroy();
	}
}
