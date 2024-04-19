import { App, FrontMatterCache, TFile } from "obsidian";
import { VaultExplorerPluginSettings } from "src/types";
import { MarkdownFileRenderData } from "../types";

export const formatFileDataForRender = (app: App, settings: VaultExplorerPluginSettings, file: TFile): MarkdownFileRenderData => {
	const frontmatter = app.metadataCache.getFileCache(
		file as TFile
	)?.frontmatter;


	const tags: string[] | null = loadPropertyValue(frontmatter, "tags", true);

	const {
		url: urlProp,
		favorite: favoriteProp,
		source: sourceProp,
		status: statusProp,
	} = settings.properties;

	const url: string | null = loadPropertyValue(frontmatter, urlProp);
	const favorite: string | null = loadPropertyValue(frontmatter, favoriteProp);
	const source: string | null = loadPropertyValue(frontmatter, sourceProp);
	const status: string | null = loadPropertyValue(frontmatter, statusProp);

	return {
		name: file.basename,
		path: file.path,
		tags,
		source,
		favorite,
		url,
		status,
	};
}

const loadPropertyValue = (frontmatter: FrontMatterCache | undefined, propertyName: string, isArray = false) => {
	if (!frontmatter) {
		return null;
	}

	const propertyValue = frontmatter?.[propertyName];

	if (isArray) {
		if (propertyValue === undefined || propertyValue === null) {
			return null;
		} else if (Array.isArray(propertyValue)) {
			return propertyValue;
		} else {
			//If the property is not an array, return it as an array
			//This is a bug in Obsidian?
			return [propertyValue];
		}
	}

	return propertyValue ?? null;

}
