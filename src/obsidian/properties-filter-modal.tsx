import { App, Modal } from "obsidian";
import React from "react";
import { Root, createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import AppMountProvider from "src/react/components/shared/app-mount-provider";
import PropertiesFilterApp from "src/react/components/properties-filter-app";
import { store } from "src/redux/store";
import { getCurrentSettings, onSettingsChange } from "src/types";

export default class PropertiesFilterModal extends Modal {
	root: Root | null;
	app: App;
	getCurrentSettings: getCurrentSettings;
	onSettingsChange: onSettingsChange;

	constructor(
		app: App,
		getCurrentSettings: getCurrentSettings,
		onSettingsChange: onSettingsChange
	) {
		super(app);
		this.root = null;
		this.app = app;
		this.getCurrentSettings = getCurrentSettings;
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
						getCurrentSettings={this.getCurrentSettings}
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
