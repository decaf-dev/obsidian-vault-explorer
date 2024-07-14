import { MarkdownView } from "obsidian";
import VaultExplorerPlugin from "src/main";

export const openInCurrentTab = (
	plugin: VaultExplorerPlugin,
	filePath: string
) => {
	const leaves = plugin.app.workspace.getLeavesOfType("markdown");
	const leaf = leaves.find((leaf) => {
		return ((leaf.view as MarkdownView).file?.path ?? "") === filePath;
	});

	if (leaf) {
		plugin.app.workspace.setActiveLeaf(leaf);
	} else {
		plugin.app.workspace.openLinkText("", filePath, "tab", {
			active: true,
		});
	}
};
