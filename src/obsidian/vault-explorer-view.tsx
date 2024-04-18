import { App, ItemView, WorkspaceLeaf } from "obsidian";

import React from "react";
import { createRoot, Root } from "react-dom/client";

import { VAULT_EXPLORER_VIEW } from "src/constants";
import ReactApp from "src/react/index";
import AppMountProvider from "src/react/app-mount-provider";
import { onSettingsChange, VaultExplorerPluginSettings } from "src/types";
import { Provider } from "react-redux";
import { store } from "src/redux/store";

export default class VaultExplorerView extends ItemView {
	root: Root | null;
	app: App;
	onSettingsChange: onSettingsChange;

	constructor(
		leaf: WorkspaceLeaf,
		app: App,
		onSettingsChange: onSettingsChange
	) {
		super(leaf);
		this.root = null;
		this.app = app;
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
				<Provider store={store}>
					<AppMountProvider
						app={this.app}
						onSettingsChange={this.onSettingsChange}
					>
						<ReactApp />
					</AppMountProvider>
				</Provider>
			</React.StrictMode>
		);
	}

	async onClose() {
		this.root?.unmount();
	}
}
