import { App, Menu, Notice } from "obsidian";
import { CoverImageFit, VaultExplorerPluginSettings } from "src/types";

export const openContextMenu = (
	e: MouseEvent,
	filePath: string,
	app: App,
	settings: VaultExplorerPluginSettings,
	enablePremiumFeatures: boolean,
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
	const { confirmBeforeDelete } = settings;

	const menu = new Menu();
	menu.setUseNativeMenu(true);
	menu.addItem((item) => {
		item.setTitle("Open in new tab");
		item.onClick(() => openInNewTab(app, filePath));
	});
	menu.addItem((item) => {
		item.setTitle("Open to the right");
		item.onClick(() => openToTheRight(app, filePath));
	});
	menu.addItem((item) => {
		item.setTitle("Open in new window");
		item.onClick(() => openInNewWindow(app, filePath));
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
	menu.addSeparator();
	menu.addItem((item) => {
		item.setTitle("Delete");
		item.onClick(async () => {
			if (!enablePremiumFeatures) {
				new Notice(
					"This feature requires a premium Vault Explorer license."
				);
				return;
			}
			if (confirmBeforeDelete) {
				if (confirm("Are you sure you want to delete this file?")) {
					await deleteFile(app, filePath);
				}
			} else {
				await deleteFile(app, filePath);
			}
		});
	});
	menu.showAtMouseEvent(e);
};

const deleteFile = async (app: App, filePath: string) => {
	const file = app.vault.getAbstractFileByPath(filePath);
	if (!file) return;

	return app.vault.delete(file);
};

const openToTheRight = (app: App, filePath: string) => {
	app.workspace.openLinkText("", filePath, "split", {
		active: false,
	});
};

const openInNewTab = (app: App, filePath: string) => {
	app.workspace.getLeaf().setViewState({
		type: "markdown",
		active: false,
		state: {
			file: filePath,
		},
	});
};

const openInNewWindow = (app: App, filePath: string) => {
	app.workspace.openLinkText("", filePath, "window");
};
