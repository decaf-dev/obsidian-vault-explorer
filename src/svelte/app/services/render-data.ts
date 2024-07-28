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
import {
	findFirstImageEmbedTarget,
	isImageExtension,
	isImageUrl,
} from "./utils/image-utils";
import { removeFrontmatter } from "./utils/content-utils";
import { isHttpsLink } from "./utils/url-utils";
import {
	getURIForWikiLink,
	getURIForWikiLinkTarget,
} from "./utils/wiki-link-utils";
import {
	getSocialMediaImageEntry,
	isSocialMediaImageEntryExpired,
} from "./social-media-image-cache";

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
		imageUrl: imageUrlProp,
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

	let imageUrl: string | null = null;

	//Handle image extension
	if (isImageExtension(extension)) {
		imageUrl = app.vault.getResourcePath(file);
	}

	//Handle image property
	if (imageUrl === null && coverImageSource !== "off") {
		const loadedUrl = loadPropertyValue<string>(
			fileFrontmatter,
			imageUrlProp,
			PropertyType.TEXT
		);

		if (loadedUrl !== null) {
			const uri = getURIForWikiLink(app, loadedUrl, path);
			if (uri && isImageUrl(uri)) {
				imageUrl = uri;
			} else if (isHttpsLink(loadedUrl)) {
				imageUrl = loadedUrl;
			}
		}
	}

	//Handle image in frontmatter
	if (imageUrl === null && coverImageSource !== "off") {
		const textProperties: FileTextProperties = loadTextProperties(
			app,
			fileFrontmatter
		);

		for (const property of textProperties) {
			const { value } = property;
			const uri = getURIForWikiLink(app, value, path);
			if (uri && isImageUrl(uri)) {
				imageUrl = uri;
				break;
			} else if (isHttpsLink(value)) {
				imageUrl = value;
				break;
			}
		}
	}

	if (imageUrl === null && coverImageSource === "frontmatter-and-body") {
		if (fileContent !== null) {
			const body = removeFrontmatter(fileContent);
			const target = findFirstImageEmbedTarget(body);

			if (target) {
				let loadedUrl = target;
				if (!target.startsWith("https://")) {
					const uri = getURIForWikiLinkTarget(app, target, path);
					if (uri) {
						loadedUrl = uri;
					}
				}
				imageUrl = loadedUrl;
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
