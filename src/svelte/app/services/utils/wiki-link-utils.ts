import { App } from "obsidian";

export const getURIForWikiLink = (app: App, value: string, path: string) => {
	//Make sure that it is a wiki link
	if (value.startsWith("[[") && value.endsWith("]]")) {
		const link = value.substring(2, value.length - 2);
		return getURIForWikiLinkTarget(app, link, path);
	}
	return null;
};

export const getURIForEmbedLink = (app: App, value: string, path: string) => {
	//Make sure that it is a wiki link
	if (value.startsWith("![[") && value.endsWith("]]")) {
		const link = value.substring(3, value.length - 2);
		return getURIForWikiLinkTarget(app, link, path);
	}
	return null;
};

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
