import { App } from "obsidian";

export const getURIForWikiLinkTarget = (
	app: App,
	target: string,
	path: string
) => {
	//Get the link file
	//We use this function because a link can exclude folders when the `New link format` setting
	//is set to `shortest path when possible`.
	const linkFile = app.metadataCache.getFirstLinkpathDest(target, path);

	if (linkFile) {
		const resourcePath = app.vault.getResourcePath(linkFile);
		return resourcePath;
	}
	return null;
};
