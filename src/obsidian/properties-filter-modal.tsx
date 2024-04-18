import { App, Modal } from "obsidian";
import React from "react";
import { Root, createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import AppMountProvider from "src/react/app-mount-provider";
import PropertiesFilterApp from "src/react/properties-filter-app";
import { store } from "src/redux/store";
import { VaultExplorerPluginSettings, onSettingsChange } from "src/types";

export default class PropertiesFilterModal extends Modal {
	root: Root | null;
	app: App;
	settings: VaultExplorerPluginSettings;
	onSettingsChange: onSettingsChange;

	constructor(
		app: App,
		settings: VaultExplorerPluginSettings,
		onSettingsChange: onSettingsChange
	) {
		super(app);
		this.root = null;
		this.app = app;
		this.settings = settings;
		this.onSettingsChange = onSettingsChange;
	}

	onOpen(): void {
		const { contentEl } = this;

		const root = createRoot(contentEl);
		root.render(
			<React.StrictMode>
				<Provider store={store}>
					<AppMountProvider
						app={this.app}
						onSettingsChange={this.onSettingsChange}
					>
						<PropertiesFilterApp />
					</AppMountProvider>
				</Provider>
			</React.StrictMode>
		);
		this.root = root;
	}

	onClose(): void {
		const { contentEl } = this;
		this.root?.unmount();
		contentEl.empty();
	}
}
