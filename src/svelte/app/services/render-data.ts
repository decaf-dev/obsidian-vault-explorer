import { App, FrontMatterCache, TFile } from "obsidian";
import {
	CoverImageFit,
	PropertyType,
	VaultExplorerPluginSettings,
} from "src/types";
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
import { isImageExtension } from "./utils/image-utils";
import { removeFrontmatter } from "./utils/content-utils";
import { getURIForWikiLinkTarget } from "./utils/wiki-link-utils";
import { isUrl, isWikiLink } from "./link-utils/link-validators";
import {
	getExternalEmbedTarget,
	getInternalEmbedTarget,
	getWikiLinkTarget,
} from "./link-utils/link-target-getters";
import {
	getFirstExternalEmbed,
	getFirstInternalEmbed,
} from "./link-utils/link-getters";

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

	const { loadBodyTags } = settings;
	const { coverImageSources } = settings.views.grid;
	const {
		createdDate: createdDateProp,
		modifiedDate: modifiedDateProp,
		url: urlProp,
		image: imageProp,
		coverImageFit: coverImageFitProp,
		favorite: favoriteProp,
		custom1: custom1Prop,
		custom2: custom2Prop,
		custom3: custom3Prop,
	} = settings.properties;

	let tags: string[] | null = loadPropertyValue<string[]>(
		fileFrontmatter,
		"tags",
		PropertyType.LIST
	);
	if (fileContent && loadBodyTags) {
		const body = removeFrontmatter(fileContent);
		const TAG_REGEX = /#\w+(\/\w+)*/g;
		const bodyTags = body.match(TAG_REGEX);

		//Keep the tags array null if there are no tags in the frontmatter or body
		if (bodyTags !== null && bodyTags.length > 0) {
			//Remove the hash from the tags
			const tagsWithoutHash = bodyTags.map((tag) => tag.slice(1));
			tags = Array.from(new Set([...(tags ?? []), ...tagsWithoutHash]));
		}
	}

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

	let coverImageFit: CoverImageFit | null = loadPropertyValue<string>(
		fileFrontmatter,
		coverImageFitProp,
		PropertyType.TEXT
	) as CoverImageFit | null;
	if (coverImageFit === null) {
		coverImageFit = settings.views.grid.coverImageFit;
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

	for (const imageSource of coverImageSources) {
		const { type, isEnabled } = imageSource;
		if (isEnabled) {
			switch (type) {
				case "image-property": {
					const loadedUrl = handleImagePropertyCoverSource(
						app,
						fileFrontmatter,
						path,
						imageProp
					);
					if (loadedUrl !== null) {
						imageUrl = loadedUrl;
					}
					break;
				}
				case "url-property": {
					const loadedUrl = handleUrlPropertyCoverSource(
						fileFrontmatter,
						urlProp
					);
					if (loadedUrl !== null) {
						imageUrl = loadedUrl;
					}
					break;
				}
				case "frontmatter": {
					const loadedUrl = handleFrontmatterCoverSource(
						app,
						fileFrontmatter,
						path
					);
					if (loadedUrl !== null) {
						imageUrl = loadedUrl;
					}
					break;
				}
				case "body": {
					const loadedUrl = handleBodyCoverSource(
						app,
						path,
						fileContent
					);
					if (loadedUrl !== null) {
						imageUrl = loadedUrl;
					}
					break;
				}
				default:
					throw new Error(
						`Unhandled cover image source type: ${type}`
					);
			}
			if (imageUrl !== null) {
				break; // Exit the loop if a non-null URL is found
			}
		}
	}

	const displayName = extension === "md" ? basename : name;
	const basePath = path.includes("/")
		? path.substring(0, path.lastIndexOf("/"))
		: "/";

	return {
		id: fileId,
		displayName,
		path,
		baseName: basename,
		coverImageFit,
		basePath,
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

const handleImagePropertyCoverSource = (
	app: App,
	fileFrontmatter: FrontMatterCache | undefined,
	filePath: string,
	imageProperty: string
) => {
	const propertyValue = loadPropertyValue<string>(
		fileFrontmatter,
		imageProperty,
		PropertyType.TEXT
	);
	return getImageUrlFromProperty(app, filePath, propertyValue);
};

const handleUrlPropertyCoverSource = (
	fileFrontmatter: FrontMatterCache | undefined,
	urlProperty: string
) => {
	const propertyValue = loadPropertyValue<string>(
		fileFrontmatter,
		urlProperty,
		PropertyType.TEXT
	);
	if (propertyValue !== null) {
		if (isUrl(propertyValue)) {
			return propertyValue;
		}
	}
	return null;
};

const handleFrontmatterCoverSource = (
	app: App,
	fileFrontmatter: FrontMatterCache | undefined,
	filePath: string
) => {
	const textProperties: FileTextProperties = loadTextProperties(
		app,
		fileFrontmatter
	);

	for (const property of textProperties) {
		const { value } = property;
		const imageUrl = getImageUrlFromProperty(app, filePath, value);
		if (imageUrl) {
			return imageUrl;
		}
	}
	return null;
};

const handleBodyCoverSource = (
	app: App,
	filePath: string,
	fileContent: string | null
) => {
	if (fileContent === null) return null;

	const body = removeFrontmatter(fileContent);
	const firstInternalLink = getFirstInternalEmbed(body);
	if (firstInternalLink) {
		const target = getInternalEmbedTarget(firstInternalLink);
		if (target) {
			const uri = getURIForWikiLinkTarget(app, target, filePath);
			if (uri) {
				return uri;
			}
		}
	}

	const firstExternalLink = getFirstExternalEmbed(body);
	if (firstExternalLink) {
		const target = getExternalEmbedTarget(firstExternalLink);
		if (target) {
			return target;
		}
	}

	return null;
};

const getImageUrlFromProperty = (
	app: App,
	filePath: string,
	propertyValue: string | null
) => {
	if (propertyValue === null) return null;

	if (isWikiLink(propertyValue)) {
		const target = getWikiLinkTarget(propertyValue);
		if (target) {
			const uri = getURIForWikiLinkTarget(app, target, filePath);
			if (uri) {
				return uri;
			}
		}
	} else if (isUrl(propertyValue)) {
		return propertyValue;
	}
	return null;
};
