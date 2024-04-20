import { App, FrontMatterCache, TFile } from "obsidian";
import { PropertyFilterGroup } from "src/types";
import { FilterCondition, TextFilterCondition } from "src/types";

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
export const filterByProperty = (frontmatter: FrontMatterCache | undefined, groups: PropertyFilterGroup[]) => {
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

const matchesPropertyFilter = (
	condition: FilterCondition,
	propertyValue: string,
	compare: string,
	shouldMatchIfNull: boolean
): boolean => {
	propertyValue = propertyValue.toLowerCase().trim();
	compare = compare.toLowerCase().trim();

	switch (condition) {
		case TextFilterCondition.IS:
			if (compare === "") return shouldMatchIfNull;
			return propertyValue === compare;
		case TextFilterCondition.IS_NOT:
			if (compare === "") return shouldMatchIfNull;
			return propertyValue !== compare;
		case TextFilterCondition.CONTAINS:
			if (compare === "") return shouldMatchIfNull;
			return propertyValue.includes(compare);
		case TextFilterCondition.DOES_NOT_CONTAIN:
			if (compare === "") return shouldMatchIfNull;
			return !propertyValue.includes(compare);
		case TextFilterCondition.STARTS_WITH:
			if (compare === "") return shouldMatchIfNull;
			return propertyValue.startsWith(compare);
		case TextFilterCondition.ENDS_WITH:
			if (compare === "") return shouldMatchIfNull;
			return propertyValue.endsWith(compare);
		case TextFilterCondition.IS_EMPTY:
			return propertyValue === "";
		case TextFilterCondition.IS_NOT_EMPTY:
			return propertyValue !== "";
		default:
			throw new Error("Filter condition not yet supported");
	}
};
