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

			let propertyValue: (string | string[] | boolean | number | null) = frontmatter?.[propertyName] ?? null;

			//TODO handle array
			//TODO handle date
			//TODO handle number
			//TODO handle boolean
			if (typeof propertyValue === "boolean") {
				propertyValue = propertyValue.toString();
			} else if (typeof propertyValue === "number") {
				propertyValue = propertyValue.toString();
			} else if (Array.isArray(propertyValue)) {
				isValid = false;
				return;
			}

			const doesMatch = matchesPropertyFilter(
				condition,
				propertyValue,
				value,
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
	propertyValue: string | null,
	compare: string,
): boolean => {
	if (propertyValue) {
		propertyValue = propertyValue.toLowerCase().trim();
	}

	compare = compare.toLowerCase().trim();

	switch (condition) {
		case TextFilterCondition.IS:
			if (propertyValue === null) return false;
			return propertyValue === compare;
		case TextFilterCondition.IS_NOT:
			if (propertyValue === null) return false;
			return propertyValue !== compare;
		case TextFilterCondition.CONTAINS:
			if (propertyValue === null) return false;
			return propertyValue.includes(compare);
		case TextFilterCondition.DOES_NOT_CONTAIN:
			if (propertyValue === null) return false;
			return !propertyValue.includes(compare);
		case TextFilterCondition.STARTS_WITH:
			if (propertyValue === null) return false;
			return propertyValue.startsWith(compare);
		case TextFilterCondition.ENDS_WITH:
			if (propertyValue === null) return false;
			return propertyValue.endsWith(compare);
		case TextFilterCondition.IS_EMPTY:
			if (propertyValue === null) return false;
			return propertyValue === "";
		case TextFilterCondition.IS_NOT_EMPTY:
			if (propertyValue === null) return false;
			return propertyValue !== "";
		case TextFilterCondition.EXISTS:
			return propertyValue !== null;
		case TextFilterCondition.DOES_NOT_EXIST:
			return propertyValue === null;
		default:
			throw new Error("Filter condition not yet supported");
	}
};
