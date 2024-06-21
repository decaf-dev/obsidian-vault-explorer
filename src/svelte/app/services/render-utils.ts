import { FrontMatterCache, TFile } from "obsidian";
import { PropertyType, VaultExplorerPluginSettings } from "src/types";
import { MarkdownFileRenderData } from "../types";
import { getTimeMillis, isDateSupported } from "../../shared/services/time-utils";
import Logger from "js-logger";
import { loadPropertyValue } from "src/svelte/shared/services/load-property-value";

export const formatFileDataForRender = (settings: VaultExplorerPluginSettings, file: TFile, frontmatter: FrontMatterCache | undefined,): MarkdownFileRenderData => {
	const tags: string[] | null = loadPropertyValue<string[]>(frontmatter, "tags", PropertyType.LIST);

	const {
		createdDate: createdDateProp,
		modifiedDate: modifiedDateProp,
		url: urlProp,
		favorite: favoriteProp,
		custom1: custom1Prop,
		custom2: custom2Prop,
		custom3: custom3Prop,
	} = settings.properties;

	const url: string | null = loadPropertyValue<string>(frontmatter, urlProp, PropertyType.TEXT);
	const favorite: boolean | null = loadPropertyValue<boolean>(frontmatter, favoriteProp, PropertyType.CHECKBOX);
	const creationDate: string | null = loadPropertyValue<string>(frontmatter, createdDateProp, PropertyType.DATE || PropertyType.DATETIME);
	const modifiedDate: string | null = loadPropertyValue<string>(frontmatter, modifiedDateProp, PropertyType.DATE || PropertyType.DATETIME);

	const custom1: string | null = loadPropertyValue<string>(frontmatter, custom1Prop, PropertyType.TEXT);
	const custom2: string | null = loadPropertyValue<string>(frontmatter, custom2Prop, PropertyType.TEXT);
	const custom3: string | null = loadPropertyValue<string>(frontmatter, custom3Prop, PropertyType.TEXT);

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
