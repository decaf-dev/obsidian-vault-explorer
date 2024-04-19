import { App, TFile } from "obsidian";
import { PropertyFilterGroup } from "src/types";
import { matchesPropertyFilter } from "../../../../react/components/app/utils";

//Tests
//Group is enabled/disabled
//Filter is enabled/disabled
//Property name is empty
//Property value is empty
//Property value is not a string
//Property value is a string
//Property value is a string and matches filter
//Property value is a string and does not match filter
//Property value is an array
//Property value is a date
//Property value is a number
export const filterByProperty = (app: App, file: TFile, groups: PropertyFilterGroup[]) => {
	const frontmatter = app.metadataCache.getFileCache(
		file as TFile
	)?.frontmatter;

	let isValid = true;
	groups.forEach((group) => {
		if (!group.isEnabled) return;

		group.filters.forEach((filter) => {
			if (!filter.isEnabled) return;

			const { propertyName, condition, value } = filter;
			if (propertyName === "") return;

			let propertyValue = frontmatter?.[propertyName] ?? "";

			//TODO handle array
			//TODO handle date
			//TODO handle number
			//TODO handle boolean
			if (typeof propertyValue === "boolean") {
				propertyValue = (propertyValue as boolean).toString();
			} else if (typeof propertyValue === "number") {
				propertyValue = (propertyValue as number).toString();
			} else if (typeof propertyValue !== "string") {
				isValid = false;
				return;
			}

			const doesMatch = matchesPropertyFilter(
				condition,
				propertyValue,
				value,
				true
			);

			if (!doesMatch) {
				isValid = false;
			}
		});
	});
	return isValid;
}
