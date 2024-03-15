import { App, ItemView, WorkspaceLeaf } from "obsidian";

import React from "react";
import { createRoot, Root } from "react-dom/client";

import { FRONTMATTER_VIEW } from "src/constants";
import ReactView from "src/react/index";
import AppMountProvider from "src/react/app-mount-provider";
import { FrontmatterViewsPluginSettings } from "src/types";

export default class FrontmatterView extends ItemView {
	root: Root | null;
	app: App;
	settings: FrontmatterViewsPluginSettings;

	constructor(
		leaf: WorkspaceLeaf,
		app: App,
		settings: FrontmatterViewsPluginSettings
	) {
		super(leaf);
		this.root = null;
		this.app = app;
		this.settings = settings;
	}

	getViewType(): string {
		return FRONTMATTER_VIEW;
	}
	getDisplayText(): string {
		return "Frontmatter View";
	}

	async onOpen() {
		const container = this.containerEl.children[1];
		this.root = createRoot(container);
		this.root.render(
			<React.StrictMode>
				<AppMountProvider
					app={this.app}
					leaf={this.leaf}
					settings={this.settings}
				>
					<ReactView />
				</AppMountProvider>
			</React.StrictMode>
		);
	}

	async onClose() {
		this.root?.unmount();
	}
}
