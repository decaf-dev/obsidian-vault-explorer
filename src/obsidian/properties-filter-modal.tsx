import { App, Modal, WorkspaceLeaf } from "obsidian";
import { Root, createRoot } from "react-dom/client";
import AppMountProvider from "src/react/app-mount-provider";
import PropertiesFilterApp from "src/react/properties-filter-app";
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
			<AppMountProvider
				app={this.app}
				settings={this.settings}
				onSettingsChange={this.onSettingsChange}
			>
				<PropertiesFilterApp />
			</AppMountProvider>
		);
		this.root = root;
	}

	onClose(): void {
		const { contentEl } = this;
		this.root?.unmount();
		contentEl.empty();
	}
}
