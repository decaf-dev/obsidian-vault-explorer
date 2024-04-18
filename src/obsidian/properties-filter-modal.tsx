import { App, Modal } from "obsidian";
import { getCurrentSettings, onSettingsChange } from "src/types";
import Component from "../svelte/component.svelte";

export default class PropertiesFilterModal extends Modal {
	component: Component | null;
	app: App;
	getCurrentSettings: getCurrentSettings;
	onSettingsChange: onSettingsChange;

	constructor(
		app: App,
		getCurrentSettings: getCurrentSettings,
		onSettingsChange: onSettingsChange
	) {
		super(app);
		this.app = app;
		this.component = null;
		this.getCurrentSettings = getCurrentSettings;
		this.onSettingsChange = onSettingsChange;
	}

	onOpen(): void {
		const { contentEl } = this;

		this.component = new Component({
			target: contentEl,
			props: {
				variable: 1,
			},
		});
		// const root = createRoot(contentEl);
		// root.render(
		// 	<React.StrictMode>
		// 		<Provider store={store}>
		// 			<AppMountProvider
		// 				app={this.app}
		// 				getCurrentSettings={this.getCurrentSettings}
		// 				onSettingsChange={this.onSettingsChange}
		// 			>
		// 				<PropertiesFilterApp />
		// 			</AppMountProvider>
		// 		</Provider>
		// 	</React.StrictMode>
		// );
		// this.root = root;
	}

	onClose(): void {
		const { contentEl } = this;
		this.component?.$destroy();
		contentEl.empty();
	}
}
