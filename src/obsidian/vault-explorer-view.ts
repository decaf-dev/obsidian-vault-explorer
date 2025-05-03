import { ItemView, WorkspaceLeaf } from "obsidian";

import { VAULT_EXPLORER_VIEW } from "src/constants";
import EventManager from "src/event/event-manager";
import { PluginEvent } from "src/event/types";
import VaultExplorerPlugin from "src/main";
import { mount, unmount } from "svelte";
import VaultExplorerApp from "../svelte/app/index.svelte";

export default class VaultExplorerView extends ItemView {
	vaultExplorerApp: ReturnType<typeof mount> | null;
	plugin: VaultExplorerPlugin;

	constructor(leaf: WorkspaceLeaf, plugin: VaultExplorerPlugin) {
		super(leaf);
		this.vaultExplorerApp = null;
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

		this.vaultExplorerApp = mount(VaultExplorerApp, {
			target: containerEl
		});
	}

	async onClose() {
		if (this.vaultExplorerApp) {
			unmount(this.vaultExplorerApp);
		}
	}
}
