import Logger from "js-logger";
import { App, FrontMatterCache } from "obsidian";
import { PropertyType } from "src/types";
import { isDateSupported } from "./time-utils";
import { getObsidianPropertiesByType } from "src/obsidian/utils";

export type FileTextProperties = Record<string, string>[];

export const loadTextProperties = (
	app: App,
	frontmatter: FrontMatterCache | undefined
): FileTextProperties => {
	//If the file has no frontmatter, return null
	if (!frontmatter) {
		return [];
	}

	const allTextProperties = getObsidianPropertiesByType(app, "text");

	let textProperties: FileTextProperties = [];

	for (const entry of Object.entries(frontmatter)) {
		const [key, value] = entry;
		if (value === null) {
			continue;
		}
		const isTextProperty = allTextProperties.find((p) => p.name === key);
		if (isTextProperty) {
			textProperties.push({
				name: key,
				value: value as string,
			});
		}
	}

	return textProperties;
};

/**
 * Loads a property value from the frontmatter object
 * @param frontmatter - The frontmatter object to load the property value from
 * @param propertyName - The name of the property to load
 * @param expectedType - The expected type of the property
 * @returns - The property value or null if the property isn't valid
 */
export const loadPropertyValue = <T>(
	frontmatter: FrontMatterCache | undefined,
	propertyName: string,
	expectedType: PropertyType
): T | null => {
	//If the file has no frontmatter, return null
	if (!frontmatter) {
		return null;
	}

	//If the property name is empty, return null
	//This can happen if the user has not set a property name
	if (propertyName === "") {
		return null;
	}

	const propertyValue = frontmatter[propertyName];

	if (propertyValue === undefined || propertyValue === null) {
		return null;
	}

	//Validate the property value for the expected type
	if (expectedType === PropertyType.TEXT) {
		if (typeof propertyValue !== "string") {
			Logger.warn(
				`Property value of type 'text' is not a string: ${propertyValue}`
			);
			return null;
		}
	} else if (expectedType === PropertyType.NUMBER) {
		if (typeof propertyValue !== "number") {
			Logger.warn(
				`Property value of type 'number' is not a number: ${propertyValue}`
			);
			return null;
		}
	} else if (expectedType === PropertyType.DATE) {
		if (typeof propertyValue !== "string") {
			Logger.warn(
				`Property value of type 'date' is not a string: ${propertyValue}`
			);
			return null;
		}
	} else if (expectedType === PropertyType.DATETIME) {
		if (typeof propertyValue !== "string") {
			Logger.warn(
				`Property value of type 'datetime' is not a string: ${propertyValue}`
			);
			return null;
		}
	} else if (expectedType === PropertyType.CHECKBOX) {
		if (typeof propertyValue !== "boolean") {
			Logger.warn(
				`Property value of type 'checkbox' is not a boolean: ${propertyValue}`
			);
			return null;
		}
	} else if (expectedType === PropertyType.LIST) {
		if (!Array.isArray(propertyValue)) {
			Logger.warn(
				`Property value of type 'list' is not an array: ${propertyValue}`
			);
			//Don't return null here, because the property value can be converted to an array
		}
	}

	//In older versions of Obsidian, the date can be stored in the frontmatter
	//in a format other than YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS
	if (expectedType === PropertyType.DATE) {
		if (!isDateSupported(propertyValue)) {
			Logger.warn(
				`Property value of type 'date' has unsupported date format: ${propertyValue}`
			);
			return null;
		}
	} else if (expectedType === PropertyType.DATETIME) {
		if (!isDateSupported(propertyValue)) {
			Logger.warn(
				`Property value of type 'datetime' has unsupported date format: ${propertyValue}`
			);
			return null;
		}
	}

	if (expectedType === PropertyType.LIST) {
		//If the property is not an array, return it as an array
		//This is a bug in Obsidian?
		if (!Array.isArray(propertyValue)) {
			return [propertyValue] as unknown as T;
		}

		//Filter out null and undefined values
		return propertyValue.filter(
			(v) => v !== null && v !== undefined
		) as unknown as T;
	}

	return propertyValue as T;
};
