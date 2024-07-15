import { App, FrontMatterCache, TFile } from "obsidian";
import { PropertyType, VaultExplorerPluginSettings } from "src/types";
import { FileRenderData } from "../types";
import Logger from "js-logger";
import { loadPropertyValue } from "src/svelte/shared/services/load-property-value";
import {
	isDateSupported,
	getTimeMillis,
} from "src/svelte/shared/services/time-utils";
import { isImageExtension } from "./utils/image-utils";

/**
 * Formats the file's data for rendering
 * @param app - The Obsidian app
 * @param settings - The plugin's settings
 * @param id - The file's id. This is a randomly generated identifier for the file
 * @param file - The file to format
 * @param frontmatter - The file's frontmatter
 * @param content - The file's content
 * @returns A FileRenderData object that contains the file's data formatted for rendering
 */
export const formatFileDataForRender = (
	app: App,
	settings: VaultExplorerPluginSettings,
	id: string,
	file: TFile,
	frontmatter: FrontMatterCache | undefined,
	content: string | null
): FileRenderData => {
	const { name, basename, extension, path } = file;

	const {
		createdDate: createdDateProp,
		modifiedDate: modifiedDateProp,
		url: urlProp,
		favorite: favoriteProp,
		imageUrl: imageUrlProp,
		custom1: custom1Prop,
		custom2: custom2Prop,
		custom3: custom3Prop,
	} = settings.properties;

	const tags: string[] | null = loadPropertyValue<string[]>(
		frontmatter,
		"tags",
		PropertyType.LIST
	);

	const url: string | null = loadPropertyValue<string>(
		frontmatter,
		urlProp,
		PropertyType.TEXT
	);

	const favorite: boolean | null = loadPropertyValue<boolean>(
		frontmatter,
		favoriteProp,
		PropertyType.CHECKBOX
	);
	const creationDate: string | null = loadPropertyValue<string>(
		frontmatter,
		createdDateProp,
		PropertyType.DATE || PropertyType.DATETIME
	);
	const modifiedDate: string | null = loadPropertyValue<string>(
		frontmatter,
		modifiedDateProp,
		PropertyType.DATE || PropertyType.DATETIME
	);

	const custom1: string | null = loadPropertyValue<string>(
		frontmatter,
		custom1Prop,
		PropertyType.TEXT
	);
	const custom2: string | null = loadPropertyValue<string>(
		frontmatter,
		custom2Prop,
		PropertyType.TEXT
	);
	const custom3: string | null = loadPropertyValue<string>(
		frontmatter,
		custom3Prop,
		PropertyType.TEXT
	);

	let createdMillis = file.stat.ctime;
	if (creationDate != null) {
		//It's possible that the creation date is stored in the frontmatter in an unsupported date format
		if (isDateSupported(creationDate)) {
			createdMillis = getTimeMillis(creationDate);
		} else {
			Logger.warn(
				`Property value has unsupported date format: ${creationDate}`
			);
		}
	}

	let modifiedMillis = file.stat.mtime;
	if (modifiedDate != null) {
		//It's possible that the modified date is stored in the frontmatter in an unsupported date format
		if (isDateSupported(modifiedDate)) {
			modifiedMillis = getTimeMillis(modifiedDate);
		} else {
			Logger.warn(
				`Property value has unsupported date format: ${creationDate}`
			);
		}
	}

	let imageUrl: string | null = loadPropertyValue<string>(
		frontmatter,
		imageUrlProp,
		PropertyType.TEXT
	);

	if (imageUrl?.startsWith("[[") && imageUrl.endsWith("]]")) {
		const link = imageUrl.substring(2, imageUrl.length - 2);

		//Get the link file
		//We use this function because a link can exclude folders when `New link format` is set to
		//`shortest path when possible`.
		const linkFile = app.metadataCache.getFirstLinkpathDest(link, path);

		if (linkFile) {
			const resourcePath = app.vault.getResourcePath(linkFile);
			imageUrl = resourcePath;
		} else {
			Logger.error(`Link path for image url not found: ${link}`);
			imageUrl = null;
		}
	} else if (isImageExtension(extension)) {
		imageUrl = app.vault.getResourcePath(file);
	}

	const displayName = extension === "md" ? basename : name;

	return {
		id,
		displayName,
		baseName: basename,
		path,
		extension,
		url,
		content,
		tags,
		imageUrl,
		favorite,
		createdMillis,
		modifiedMillis,
		custom1,
		custom2,
		custom3,
	};
};
