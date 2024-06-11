import { FrontMatterCache } from "obsidian";
import { CheckboxFilterCondition, DateFilterCondition, ListFilterCondition, NumberFilterCondition, PropertyFilter, PropertyFilterGroup } from "src/types";
import { FilterCondition, TextFilterCondition } from "src/types";
import Logger from "js-logger";
import { getEndOfDayMillis, getStartOfDayMillis, getTimeMillis, isDateSupported } from "../time-utils";

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
export const filterByPropertyGroups = (frontmatter: FrontMatterCache | undefined, groups: PropertyFilterGroup[]) => {
	return groups.every((group) => {
		if (!group.isEnabled) return true;
		return filterByPropertyGroup(frontmatter, group);
	});
}

const filterByPropertyGroup = (frontmatter: FrontMatterCache | undefined, group: PropertyFilterGroup) => {
	let result: boolean | null = null;

	group.filters.forEach((filter, i) => {
		if (!filter.isEnabled) return;

		const value = filterByProperty(frontmatter, filter);
		if (result === null) {
			result = value;
		} else {
			if (filter.operator === "and") {
				result = result && value;
			} else {
				result = result || value;
			}
		}
	});

	return result ?? true;
}

const filterByProperty = (frontmatter: FrontMatterCache | undefined, filter: PropertyFilter) => {
	const { propertyName, condition, value, type, matchWhenPropertyDNE } = filter;
	if (propertyName === "") return true;

	let propertyValue: (string | string[] | boolean | number | null) = frontmatter?.[propertyName] ?? null;

	if (type === "text") {
		//If the value is not a string, skip the filter
		if (propertyValue !== null && typeof propertyValue !== "string") {
			Logger.warn(`Property value is not a string: ${propertyValue}`);
			return true;
		}
		const doesMatch = doesTextMatchFilter(propertyValue, value, condition, matchWhenPropertyDNE);
		return doesMatch;
	} else if (type === "list") {
		if (propertyValue !== null && !Array.isArray(propertyValue)) {
			Logger.warn(`Property value is not an array: ${propertyValue}`);
			return true;
		}
		const compare = value.split(",").map((v) => v.trim()).filter((v) => v !== "");
		const doesMatch = doesListMatchFilter(propertyValue, compare, condition, matchWhenPropertyDNE);
		return doesMatch;
	} else if (type === "number") {
		if (propertyValue !== null && typeof propertyValue !== "number") {
			Logger.warn(`Property value is not a number: ${propertyValue}`);
			return true;
		}
		const compare = parseFloat(value);
		const doesMatch = doesNumberMatchFilter(propertyValue, compare, condition, matchWhenPropertyDNE);
		return doesMatch;
	} else if (type === "checkbox") {
		if (propertyValue !== null && typeof propertyValue !== "boolean") {
			Logger.warn(`Property value is not a boolean: ${propertyValue}`);
			return true;
		}

		const compare = value === "true";
		const doesMatch = doesCheckboxMatchFilter(propertyValue, compare, condition, matchWhenPropertyDNE);
		return doesMatch;

	} else if (type === "date" || type === "datetime") {
		if (propertyValue !== null && typeof propertyValue !== "string") {
			Logger.warn(`Property value is not a string: ${propertyValue}`);
			return true;
			//In older versions of Obsidian, the date could be stored in the frontmatter
			//in an unsupported date format
		} else if (propertyValue !== null && !isDateSupported(propertyValue)) {
			Logger.warn(`Property value has unsupported date format: ${propertyValue}`);
			return true;
		}

		const doesMatch = doesDateMatchFilter(condition, propertyValue, value, matchWhenPropertyDNE);
		return doesMatch;

	} else {
		throw new Error(`Property filter type not supported: ${type}`);
	}
}

const doesTextMatchFilter = (
	propertyValue: string | null,
	compare: string,
	condition: FilterCondition,
	matchIfNull: boolean
): boolean => {
	if (propertyValue)
		propertyValue = propertyValue.toLowerCase().trim();

	compare = compare.toLowerCase().trim();

	switch (condition) {
		case TextFilterCondition.IS:
			if (propertyValue === null) return matchIfNull;
			return propertyValue === compare;
		case TextFilterCondition.IS_NOT:
			if (propertyValue === null) return matchIfNull;
			return propertyValue !== compare;
		case TextFilterCondition.CONTAINS:
			if (propertyValue === null) return matchIfNull;
			return propertyValue.includes(compare);
		case TextFilterCondition.DOES_NOT_CONTAIN:
			if (propertyValue === null) return matchIfNull;
			return !propertyValue.includes(compare);
		case TextFilterCondition.STARTS_WITH:
			if (propertyValue === null) return matchIfNull;
			return propertyValue.startsWith(compare);
		case TextFilterCondition.ENDS_WITH:
			if (propertyValue === null) return matchIfNull;
			return propertyValue.endsWith(compare);
		case TextFilterCondition.EXISTS:
			return propertyValue !== null;
		case TextFilterCondition.DOES_NOT_EXIST:
			return propertyValue === null;
		default:
			throw new Error(`Text filter condition not supported: ${condition}`);
	}
};

const doesListMatchFilter = (
	propertyValue: string[] | null,
	compare: string[],
	condition: ListFilterCondition,
	matchIfNull: boolean
) => {
	switch (condition) {
		case ListFilterCondition.CONTAINS:
			if (propertyValue === null) return matchIfNull;
			if (compare.length === 0) return true;

			return compare.every((c) =>
				propertyValue.some((value) => value.contains(c))
			);
		case ListFilterCondition.DOES_NOT_CONTAIN:
			if (propertyValue === null) return matchIfNull;
			if (compare.length === 0) return true;

			return compare.every((c) =>
				propertyValue.every((value) => !value.contains(c))
			);
		case ListFilterCondition.EXISTS:
			return propertyValue !== null;
		case ListFilterCondition.DOES_NOT_EXIST:
			return propertyValue === null;
		default:
			throw new Error(`List filter condition not supported: ${condition}`);
	}
}

const doesDateMatchFilter = (condition: DateFilterCondition,
	propertyValue: string | null,
	compare: string | null,
	matchIfNull: boolean
) => {
	switch (condition) {
		case DateFilterCondition.IS: {
			if (propertyValue === null) return matchIfNull;
			if (compare === null) return false;

			const propertyValueTime = getTimeMillis(propertyValue);
			const dayStartTime = getStartOfDayMillis(compare);
			const dayEndTime = getEndOfDayMillis(compare);

			return (
				propertyValueTime >= dayStartTime &&
				propertyValueTime <= dayEndTime
			);
		}
		case DateFilterCondition.IS_AFTER: {
			if (propertyValue === null) return matchIfNull;
			if (compare === null) return false;

			const propertyValueTime = getTimeMillis(propertyValue);
			const dayEndTime = getEndOfDayMillis(compare);
			return propertyValueTime > dayEndTime;
		}
		case DateFilterCondition.IS_BEFORE: {
			if (propertyValue === null) return matchIfNull;
			if (compare === null) return false;

			const propertyValueTime = getTimeMillis(propertyValue);
			const dayStartTime = getStartOfDayMillis(compare);
			return propertyValueTime < dayStartTime;
		}
		case DateFilterCondition.EXISTS:
			return propertyValue !== null;
		case DateFilterCondition.DOES_NOT_EXIST:
			return propertyValue === null;
		default:
			throw new Error(`Date filter condition not supported: ${condition}`);
	}
}

const doesNumberMatchFilter = (
	propertyValue: number | null,
	compare: number,
	condition: NumberFilterCondition,
	matchIfNull: boolean
) => {
	switch (condition) {
		case NumberFilterCondition.IS_EQUAL:
			if (propertyValue === null) return matchIfNull;
			return propertyValue === compare;
		case NumberFilterCondition.IS_GREATER:
			if (propertyValue === null) return matchIfNull;
			return propertyValue > compare;
		case NumberFilterCondition.IS_GREATER_OR_EQUAL:
			if (propertyValue === null) return matchIfNull;
			return propertyValue >= compare;
		case NumberFilterCondition.IS_LESS:
			if (propertyValue === null) return matchIfNull;
			return propertyValue < compare;
		case NumberFilterCondition.IS_LESS_OR_EQUAL:
			if (propertyValue === null) return matchIfNull;
			return propertyValue <= compare;
		case NumberFilterCondition.IS_NOT_EQUAL:
			if (propertyValue === null) return matchIfNull;
			return propertyValue !== compare;
		case NumberFilterCondition.EXISTS:
			return propertyValue !== null;
		case NumberFilterCondition.DOES_NOT_EXIST:
			return propertyValue === null;
		default:
			throw new Error(`Number filter condition not supported: ${condition}`);
	}
};

const doesCheckboxMatchFilter = (
	propertyValue: boolean | null,
	compare: boolean,
	condition: CheckboxFilterCondition,
	matchIfNull: boolean
) => {
	switch (condition) {
		case CheckboxFilterCondition.IS:
			if (propertyValue === null) return matchIfNull;
			return propertyValue === compare;
		case CheckboxFilterCondition.IS_NOT:
			if (propertyValue === null) return matchIfNull;
			return propertyValue !== compare;
		case CheckboxFilterCondition.EXISTS:
			return propertyValue !== null;
		case CheckboxFilterCondition.DOES_NOT_EXIST:
			return propertyValue === null;
		default:
			throw new Error(`Checkbox filter condition not supported: ${condition}`);
	}
}
