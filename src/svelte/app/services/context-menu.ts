import { Menu } from "obsidian";
import VaultExplorerPlugin from "src/main";
import { CoverImageFit } from "src/types";

export const openContextMenu = (
	plugin: VaultExplorerPlugin,
	filePath: string,
	e: MouseEvent,
	{
		coverImageFit,
		onCoverImageFitChange,
	}: {
		coverImageFit?: CoverImageFit;
		onCoverImageFitChange?: (
			filePath: string,
			value: CoverImageFit
		) => void;
	}
) => {
	const menu = new Menu();
	menu.setUseNativeMenu(true);
	menu.addItem((item) => {
		item.setTitle("Open in new tab");
		item.onClick(() => openInNewTab(plugin, filePath));
	});
	menu.addItem((item) => {
		item.setTitle("Open to the right");
		item.onClick(() => openToTheRight(plugin, filePath));
	});
	menu.addItem((item) => {
		item.setTitle("Open in new window");
		item.onClick(() => openInNewWindow(plugin, filePath));
	});
	if (coverImageFit !== undefined && onCoverImageFitChange !== undefined) {
		menu.addSeparator();
		menu.addItem((item) => {
			item.setTitle("Cover");
			item.setChecked(coverImageFit === "cover");
			item.onClick(() => onCoverImageFitChange(filePath, "cover"));
		});
		menu.addItem((item) => {
			item.setTitle("Contain");
			item.setChecked(coverImageFit === "contain");
			item.onClick(() => onCoverImageFitChange(filePath, "contain"));
		});
	}
	menu.showAtMouseEvent(e);
};

const openToTheRight = (plugin: VaultExplorerPlugin, filePath: string) => {
	plugin.app.workspace.openLinkText("", filePath, "split", {
		active: false,
	});
};

const openInNewTab = (plugin: VaultExplorerPlugin, filePath: string) => {
	plugin.app.workspace.getLeaf().setViewState({
		type: "markdown",
		active: false,
		state: {
			file: filePath,
		},
	});
};

const openInNewWindow = (plugin: VaultExplorerPlugin, filePath: string) => {
	plugin.app.workspace.openLinkText("", filePath, "window");
};
