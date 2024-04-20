import { App } from "obsidian"
import { ObsidianProperty, ObsidianPropertyType } from "./types";

/**
 * Gets all Obsidian properties
 * NOTE: This is an undocumented API function and may break in future versions of Obsidian
 */
export const getAllObsidianProperties = (app: App) => {
	const properties = (app as any).metadataTypeManager.getAllProperties() as Record<string, ObsidianProperty>;
	return Object.values(properties).sort((a: ObsidianProperty, b: ObsidianProperty) => a.name.localeCompare(b.name));
};

export const getObsidianPropertiesByType = (app: App, type: ObsidianPropertyType) => {
	return getAllObsidianProperties(app).filter((p) => p.type === type);
}

export const getDropdownOptionsForProperties = (properties: ObsidianProperty[]) => {
	return properties.reduce((acc: Record<string, string>, cur: ObsidianProperty) => {
		acc[cur.name] = cur.name;
		return acc;
	}, { "": "Select a property" });
}
