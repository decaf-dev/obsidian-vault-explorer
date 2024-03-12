import { App, ItemView, WorkspaceLeaf } from "obsidian";

import React from "react";
import { createRoot, Root } from "react-dom/client";

import { FRONTMATTER_VIEW } from "src/constants";
import ReactView from "src/react/index";

export default class FrontmatterView extends ItemView {
	root: Root | null;
	app: App;

	constructor(leaf: WorkspaceLeaf, app: App) {
		super(leaf);
		this.root = null;
		this.app = app;
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
				<ReactView app={this.app} />
			</React.StrictMode>
		);
	}

	async onClose() {
		this.root?.unmount();
	}
}
