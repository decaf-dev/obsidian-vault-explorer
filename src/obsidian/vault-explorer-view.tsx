import { App, ItemView, WorkspaceLeaf } from "obsidian";

import { VAULT_EXPLORER_VIEW } from "src/constants";
import { getCurrentSettings, onSettingsChange } from "src/types";
import Component from "../svelte/component.svelte";

export default class VaultExplorerView extends ItemView {
	component: Component | null;
	app: App;
	onSettingsChange: onSettingsChange;
	getCurrentSettings: getCurrentSettings;

	constructor(
		leaf: WorkspaceLeaf,
		app: App,
		getCurrentSettings: getCurrentSettings,
		onSettingsChange: onSettingsChange
	) {
		super(leaf);
		this.component = null;
		this.app = app;
		this.getCurrentSettings = getCurrentSettings;
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
		const containerEl = this.containerEl.children[1];

		this.component = new Component({
			target: containerEl,
			props: {
				variable: 1,
			},
		});
		// this.root = createRoot(container);
		// this.root.render(
		// 	<React.StrictMode>
		// 		<Provider store={store}>
		// 			<AppMountProvider
		// 				app={this.app}
		// 				getCurrentSettings={this.getCurrentSettings}
		// 				onSettingsChange={this.onSettingsChange}
		// 			>
		// 				<ReactApp />
		// 			</AppMountProvider>
		// 		</Provider>
		// 	</React.StrictMode>
		// );
	}

	async onClose() {
		this.component?.$destroy();
		// this.root?.unmount();
	}
}
