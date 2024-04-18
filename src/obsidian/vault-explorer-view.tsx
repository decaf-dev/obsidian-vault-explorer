import { App, ItemView, WorkspaceLeaf } from "obsidian";

import React from "react";
import { createRoot, Root } from "react-dom/client";

import { VAULT_EXPLORER_VIEW } from "src/constants";
import ReactApp from "src/react/index";
import AppMountProvider from "src/react/app-mount-provider";
import { onSettingsChange, VaultExplorerPluginSettings } from "src/types";

export default class VaultExplorerView extends ItemView {
	root: Root | null;
	app: App;
	settings: VaultExplorerPluginSettings;
	onSettingsChange: onSettingsChange;

	constructor(
		leaf: WorkspaceLeaf,
		app: App,
		settings: VaultExplorerPluginSettings,
		onSettingsChange: onSettingsChange
	) {
		super(leaf);
		this.root = null;
		this.app = app;
		this.settings = settings;
		this.onSettingsChange = onSettingsChange;
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
		const container = this.containerEl.children[1];
		this.root = createRoot(container);
		this.root.render(
			<React.StrictMode>
				<AppMountProvider
					app={this.app}
					settings={this.settings}
					onSettingsChange={this.onSettingsChange}
				>
					<ReactApp />
				</AppMountProvider>
			</React.StrictMode>
		);
	}

	async onClose() {
		this.root?.unmount();
	}
}
