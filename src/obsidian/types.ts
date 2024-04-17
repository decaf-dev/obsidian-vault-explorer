export interface ObsidianProperty {
	name: string;
	type?: ObsidianPropertyType;
	count: number;
}

export type ObsidianPropertyType = "text" | "multitext" | "date" | "datetime" | "checkbox" | "tags" | "aliases" | "number";
