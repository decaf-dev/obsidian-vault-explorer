import { App, FrontMatterCache, TFile } from "obsidian";
import { PropertyType, VaultExplorerPluginSettings } from "src/types";
import { FileRenderData } from "../types";
import Logger from "js-logger";
import {
	FileTextProperties,
	loadPropertyValue,
	loadTextProperties,
} from "src/svelte/shared/services/load-property-value";
import {
	isDateSupported,
	getTimeMillis,
} from "src/svelte/shared/services/time-utils";
import { findFirstImageEmbed, isImageExtension } from "./utils/image-utils";
import { removeFrontmatter } from "./utils/content-utils";

/**
 * Formats the file's data for rendering
 * @param app - The Obsidian app
 * @param settings - The plugin's settings
 * @param file - The file to format
 * @param fileId - The file's id. This is a randomly generated identifier for the file
 * @param fileFrontmatter - The file's frontmatter
 * @param fileContent - The file's content
 * @param fileFavorite - The file's favorite status. This will be null if the file is a markdown file
 * @returns A FileRenderData object that contains the file's data formatted for rendering
 */
export const formatFileDataForRender = ({
	app,
	settings,
	file,
	fileId,
	fileFrontmatter,
	fileContent,
	fileFavorite,
}: {
	app: App;
	settings: VaultExplorerPluginSettings;
	file: TFile;
	fileId: string;
	fileFrontmatter: FrontMatterCache | undefined;
	fileContent: string | null;
	fileFavorite: boolean | null;
}): FileRenderData => {
	const { name, basename, extension, path } = file;

	const { coverImageSource } = settings.views.grid;
	const {
		createdDate: createdDateProp,
		modifiedDate: modifiedDateProp,
		url: urlProp,
		favorite: favoriteProp,
		custom1: custom1Prop,
		custom2: custom2Prop,
		custom3: custom3Prop,
	} = settings.properties;

	const tags: string[] | null = loadPropertyValue<string[]>(
		fileFrontmatter,
		"tags",
		PropertyType.LIST
	);

	const url: string | null = loadPropertyValue<string>(
		fileFrontmatter,
		urlProp,
		PropertyType.TEXT
	);

	let isFavorite: boolean | null;
	if (fileFavorite === null) {
		isFavorite = loadPropertyValue<boolean>(
			fileFrontmatter,
			favoriteProp,
			PropertyType.CHECKBOX
		);
	} else {
		isFavorite = fileFavorite;
	}

	const creationDate: string | null = loadPropertyValue<string>(
		fileFrontmatter,
		createdDateProp,
		PropertyType.DATE || PropertyType.DATETIME
	);
	const modifiedDate: string | null = loadPropertyValue<string>(
		fileFrontmatter,
		modifiedDateProp,
		PropertyType.DATE || PropertyType.DATETIME
	);

	const custom1: string | null = loadPropertyValue<string>(
		fileFrontmatter,
		custom1Prop,
		PropertyType.TEXT
	);
	const custom2: string | null = loadPropertyValue<string>(
		fileFrontmatter,
		custom2Prop,
		PropertyType.TEXT
	);
	const custom3: string | null = loadPropertyValue<string>(
		fileFrontmatter,
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

	const textProperties: FileTextProperties = loadTextProperties(
		app,
		fileFrontmatter
	);

	let imageUrl: string | null = null;
	let isSocialMediaImageUrl = false;

	//If it's an image file, get the Obsidian image url
	if (isImageExtension(extension)) {
		imageUrl = app.vault.getResourcePath(file);
	} else {
		//Otherwise, get the first link which could be a wiki link or a url
		for (const property of textProperties) {
			const { value } = property;
			if (value.startsWith("[[") && value.endsWith("]]")) {
				const link = value.substring(2, value.length - 2);

				//Get the link file
				//We use this function because a link can exclude folders when the `New link format` setting
				//is set to `shortest path when possible`.
				const linkFile = app.metadataCache.getFirstLinkpathDest(
					link,
					path
				);

				if (linkFile) {
					const resourcePath = app.vault.getResourcePath(linkFile);
					imageUrl = resourcePath;
					break;
				}
			} else if (value.startsWith("https://")) {
				imageUrl = value;
				break;
			}
		}
	}

	if (coverImageSource === "frontmatter-and-body") {
		if (fileContent !== null && imageUrl === null) {
			const body = removeFrontmatter(fileContent);
			const embedLink = findFirstImageEmbed(body);
			if (embedLink) {
				//Get the link file
				//We use this function because a link can exclude folders when the `New link format` setting
				//is set to `shortest path when possible`.
				const linkFile = app.metadataCache.getFirstLinkpathDest(
					embedLink,
					path
				);

				if (linkFile) {
					const resourcePath = app.vault.getResourcePath(linkFile);
					imageUrl = resourcePath;
				}
			}
		}

		// if (imageUrl === null && fileContent !== null) {
		// 	const body = removeFrontmatter(fileContent);
		// 	imageUrl = findFirstHttpsLink(body);
		// }
	}

	const displayName = extension === "md" ? basename : name;

	return {
		id: fileId,
		displayName,
		baseName: basename,
		path,
		extension,
		url,
		content: fileContent,
		tags,
		imageUrl,
		isFavorite,
		createdMillis,
		modifiedMillis,
		custom1,
		custom2,
		custom3,
	};
};
