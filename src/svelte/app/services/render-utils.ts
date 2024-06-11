import { FrontMatterCache, TFile } from "obsidian";
import { VaultExplorerPluginSettings } from "src/types";
import { MarkdownFileRenderData } from "../types";
import { getTimeMillis, isDateSupported } from "./time-utils";
import Logger from "js-logger";

export const formatFileDataForRender = (settings: VaultExplorerPluginSettings, file: TFile, frontmatter: FrontMatterCache | undefined,): MarkdownFileRenderData => {
	const tags: string[] | null = loadPropertyValue(frontmatter, "tags", true);

	const {
		createdDate: createdDateProp,
		modifiedDate: modifiedDateProp,
		url: urlProp,
		favorite: favoriteProp,
		custom1: custom1Prop,
		custom2: custom2Prop,
		custom3: custom3Prop,
	} = settings.properties;

	const url: string | null = loadPropertyValue(frontmatter, urlProp);
	const favorite: string | null = loadPropertyValue(frontmatter, favoriteProp);
	const creationDate: string | null = loadPropertyValue(frontmatter, createdDateProp);
	const modifiedDate: string | null = loadPropertyValue(frontmatter, modifiedDateProp);

	const custom1: string | null = loadPropertyValue(frontmatter, custom1Prop);
	const custom2: string | null = loadPropertyValue(frontmatter, custom2Prop);
	const custom3: string | null = loadPropertyValue(frontmatter, custom3Prop);

	let createdMillis = file.stat.ctime;
	if (creationDate != null) {
		//In older versions of Obsidian, the creation date could stored in the frontmatter
		//not in a supported date format
		if (isDateSupported(creationDate)) {
			createdMillis = getTimeMillis(creationDate);
		} else {
			Logger.warn(`Property value has unsupported date format: ${creationDate}`);
		}
	}

	let modifiedMillis = file.stat.mtime;
	if (modifiedDate != null) {
		//In older versions of Obsidian, the modified date could stored in the frontmatter
		//in an unsupported date format
		if (isDateSupported(modifiedDate)) {
			modifiedMillis = getTimeMillis(modifiedDate);
		} else {
			Logger.warn(`Property value has unsupported date format: ${creationDate}`);
		}
	}

	return {
		name: file.basename,
		path: file.path,
		tags,
		favorite,
		url,
		createdMillis,
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
