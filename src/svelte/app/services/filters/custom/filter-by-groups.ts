import { FrontMatterCache } from "obsidian";
import { PropertyFilter, PropertyFilterGroup } from "src/types";
import { loadPropertyValue } from "src/svelte/shared/services/load-property-value";
import { matchTextFilter } from "./match-text-filter";
import { matchCheckboxFilter } from "./match-checkbox-filter";
import { matchListFilter } from "./match-list-filter";
import { matchDateFilter } from "./match-date-filter";
import { matchNumberFilter } from "./match-number-filter";

export const filterByGroups = (frontmatter: FrontMatterCache | undefined, groups: PropertyFilterGroup[]) => {
	return groups.every((group) => {
		if (!group.isEnabled) return true;
		return filterByGroup(frontmatter, group);
	});
}

const filterByGroup = (frontmatter: FrontMatterCache | undefined, group: PropertyFilterGroup) => {
	let result: boolean | null = null;

	group.filters.forEach((filter, i) => {
		if (!filter.isEnabled) return;

		const doesMatch = filterByRule(frontmatter, filter);
		if (result === null) {
			result = doesMatch;
		} else {
			if (filter.operator === "and") {
				result = result && doesMatch;
			} else {
				result = result || doesMatch;
			}
		}
	});

	return result ?? true;
}

const filterByRule = (frontmatter: FrontMatterCache | undefined, filter: PropertyFilter) => {
	const { propertyName, condition, value, type, matchWhenPropertyDNE } = filter;
	if (propertyName === "") return true;

	if (type === "text") {
		let propertyValue = loadPropertyValue<string>(frontmatter, propertyName, type);
		if (propertyValue) {
			propertyValue = propertyValue.toLowerCase().trim();
		}
		const compare = value.toLowerCase().trim();

		const doesMatch = matchTextFilter(propertyValue, compare, condition, matchWhenPropertyDNE);
		return doesMatch;
	} else if (type === "number") {
		const propertyValue = loadPropertyValue<number>(frontmatter, propertyName, type);
		const compare = parseFloat(value.trim());

		const doesMatch = matchNumberFilter(propertyValue, compare, condition, matchWhenPropertyDNE);
		return doesMatch;
	} else if (type === "checkbox") {
		const propertyValue = loadPropertyValue<boolean>(frontmatter, propertyName, type);

		let compare = null;
		if (value === "true") {
			compare = true;
		} else if (value === "false") {
			compare = false;
		}

		const doesMatch = matchCheckboxFilter(propertyValue, compare, condition, matchWhenPropertyDNE);
		return doesMatch;
	} else if (type === "date" || type === "datetime") {
		const propertyValue = loadPropertyValue<string>(frontmatter, propertyName, type);

		const doesMatch = matchDateFilter(propertyValue, value, condition, matchWhenPropertyDNE);
		return doesMatch;
	} else if (type === "list") {
		let propertyValue = loadPropertyValue<string[]>(frontmatter, propertyName, type);
		if (propertyValue) {
			propertyValue = propertyValue.map((v) => v.toLowerCase().trim());
		}
		const compare = value.trim().split(",").map((v) => v.trim()).filter((v) => v !== "");

		const doesMatch = matchListFilter(propertyValue, compare, condition, matchWhenPropertyDNE);
		return doesMatch;
	} else {
		throw new Error(`Property filter type not supported: ${type}`);
	}
}
