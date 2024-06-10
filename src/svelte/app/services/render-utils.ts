import { FrontMatterCache, TFile } from "obsidian";
import { VaultExplorerPluginSettings } from "src/types";
import { MarkdownFileRenderData } from "../types";
import { getTimeMillis } from "./time-utils";

export const formatFileDataForRender = (settings: VaultExplorerPluginSettings, file: TFile, frontmatter: FrontMatterCache | undefined,): MarkdownFileRenderData => {
	const tags: string[] | null = loadPropertyValue(frontmatter, "tags", true);

	const {
		creationDate: creationDateProp,
		modifiedDate: modifiedDateProp,
		url: urlProp,
		favorite: favoriteProp,
		custom1: custom1Prop,
		custom2: custom2Prop,
		custom3: custom3Prop,
	} = settings.properties;

	const url: string | null = loadPropertyValue(frontmatter, urlProp);
	const favorite: string | null = loadPropertyValue(frontmatter, favoriteProp);
	const creationDate: string | null = loadPropertyValue(frontmatter, creationDateProp);
	const modifiedDate: string | null = loadPropertyValue(frontmatter, modifiedDateProp);

	const custom1: string | null = loadPropertyValue(frontmatter, custom1Prop);
	const custom2: string | null = loadPropertyValue(frontmatter, custom2Prop);
	const custom3: string | null = loadPropertyValue(frontmatter, custom3Prop);

	const creationMillis = creationDate != null ? getTimeMillis(creationDate) : file.stat.ctime;
	const modifiedMillis = modifiedDate != null ? getTimeMillis(modifiedDate) : file.stat.mtime;

	return {
		name: file.basename,
		path: file.path,
		tags,
		favorite,
		url,
		creationMillis,
		modifiedMillis,
		custom1,
		custom2,
		custom3,

	};
}

const loadPropertyValue = (frontmatter: FrontMatterCache | undefined, propertyName: string, isArray = false) => {
	if (propertyName === "") {
		return null;
	}

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
