import { FrontMatterCache } from "obsidian";
import { CheckboxFilterCondition, DateFilterCondition, ListFilterCondition, NumberFilterCondition, PropertyFilterGroup } from "src/types";
import { FilterCondition, TextFilterCondition } from "src/types";
import { getBeforeMidnightMillis, getMidnightMillis, getMillis } from "../time-utils";

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

			const { propertyName, condition, value, type } = filter;
			if (propertyName === "") return;

			let propertyValue: (string | string[] | boolean | number | null) = frontmatter?.[propertyName] ?? null;

			if (type === "text") {
				//If the value is not a string, skip the filter
				if (propertyValue !== null && typeof propertyValue !== "string") {
					console.error(`Property value is not a string: ${propertyValue}`);
					return;
				}
				const doesMatch = doesTextMatchFilter(condition, propertyValue, value);
				isValid = doesMatch;
			} else if (type === "list") {
				if (propertyValue !== null && !Array.isArray(propertyValue)) {
					console.error(`Property value is not an array: ${propertyValue}`);
					return;
				}
				const compare = value.split(",").map((v) => v.trim());
				const doesMatch = doesListMatchFilter(condition, propertyValue, compare);
				isValid = doesMatch;
			} else if (type === "number") {
				if (propertyValue !== null && typeof propertyValue !== "number") {
					console.error(`Property value is not a number: ${propertyValue}`);
					return;
				}
				const compare = parseFloat(value);
				const doesMatch = doesNumberMatchFilter(condition, propertyValue, compare);
				isValid = doesMatch;
			} else if (type === "checkbox") {
				if (propertyValue !== null && typeof propertyValue !== "boolean") {
					console.error(`Property value is not a boolean: ${propertyValue}`);
					return;
				}

				const compare = value === "true";
				const doesMatch = doesCheckboxMatchFilter(condition, propertyValue, compare);
				isValid = doesMatch;

			} else if (type === "date" || type === "datetime") {
				if (propertyValue !== null && typeof propertyValue !== "string") {
					console.error(`Property value is not a string: ${propertyValue}`);
					return;
				}

				const doesMatch = doesDateMatchFilter(condition, propertyValue, value);
				isValid = doesMatch;

			}
		});
	});
	return isValid;
}

const doesTextMatchFilter = (
	condition: FilterCondition,
	propertyValue: string | null,
	compare: string,
): boolean => {
	if (propertyValue)
		propertyValue = propertyValue.toLowerCase().trim();

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
		// case TextFilterCondition.IS_EMPTY:
		// 	if (propertyValue === null) return false;
		// 	return propertyValue === "";
		// case TextFilterCondition.IS_NOT_EMPTY:
		// 	if (propertyValue === null) return false;
		// 	return propertyValue !== "";
		case TextFilterCondition.EXISTS:
			return propertyValue !== null;
		case TextFilterCondition.DOES_NOT_EXIST:
			return propertyValue === null;
		default:
			throw new Error(`Text filter condition not supported: ${condition}`);
	}
};

const doesListMatchFilter = (condition: ListFilterCondition, propertyValue: string[] | null, compare: string[]) => {
	console.log({
		propertyValue,
		compare,
		condition
	})
	switch (condition) {
		case ListFilterCondition.CONTAINS:
			if (propertyValue === null) return false;

			return propertyValue.some((value) => //Union
				compare.some((c) => c === value)
			);
		case ListFilterCondition.DOES_NOT_CONTAIN:
			if (propertyValue === null) return false;

			return propertyValue.every((value) => //Complement
				compare.every((c) => c !== value)
			);
		// case ListFilterCondition.IS_EMPTY:
		// 	if (propertyValue === null) return false;
		// 	return propertyValue.length === 0;
		// case ListFilterCondition.IS_NOT_EMPTY:
		// 	if (propertyValue === null) return false;
		// return propertyValue.length !== 0;
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
	compare: string | null) => {

	switch (condition) {
		case DateFilterCondition.IS: {
			if (propertyValue === null) return false;
			if (compare === null) return false;

			const propertyValueTime = getMillis(propertyValue);
			const dayStartTime = getMidnightMillis(compare);
			const dayEndTime = getBeforeMidnightMillis(compare);

			return (
				propertyValueTime >= dayStartTime &&
				propertyValueTime <= dayEndTime
			);
		}
		case DateFilterCondition.IS_AFTER: {
			if (propertyValue === null) return false;
			if (compare === null) return false;

			const propertyValueTime = getMillis(propertyValue);
			const dayEndTime = getBeforeMidnightMillis(compare);
			return propertyValueTime > dayEndTime;
		}
		case DateFilterCondition.IS_BEFORE: {
			if (propertyValue === null) return false;
			if (compare === null) return false;

			const propertyValueTime = getMillis(propertyValue);
			const dayStartTime = getMidnightMillis(compare);
			return propertyValueTime < dayStartTime;
		}
		// case DateFilterCondition.IS_EMPTY:
		// 	return propertyValue === null;
		// case DateFilterCondition.IS_NOT_EMPTY:
		// 	return propertyValue !== null;
		case DateFilterCondition.EXISTS:
			return propertyValue !== null;
		case DateFilterCondition.DOES_NOT_EXIST:
			return propertyValue === null;
		default:
			throw new Error(`Date filter condition not supported: ${condition}`);
	}
}

export const doesNumberMatchFilter = (
	condition: NumberFilterCondition,
	propertyValue: number | null,
	compare: number,
) => {
	switch (condition) {
		case NumberFilterCondition.IS_EQUAL:
			if (propertyValue === null) return false;
			return propertyValue === compare;
		case NumberFilterCondition.IS_GREATER:
			if (propertyValue === null) return false;
			return propertyValue > compare;
		case NumberFilterCondition.IS_GREATER_OR_EQUAL:
			if (propertyValue === null) return false;
			return propertyValue >= compare;
		case NumberFilterCondition.IS_LESS:
			if (propertyValue === null) return false;
			return propertyValue < compare;
		case NumberFilterCondition.IS_LESS_OR_EQUAL:
			if (propertyValue === null) return false;
			return propertyValue <= compare;
		case NumberFilterCondition.IS_NOT_EQUAL:
			if (propertyValue === null) return false;
			return propertyValue !== compare;
		// case NumberFilterCondition.IS_EMPTY:
		// 	return propertyValue === null;
		// case NumberFilterCondition.IS_NOT_EMPTY:
		// 	return propertyValue !== null;
		case NumberFilterCondition.EXISTS:
			return propertyValue !== null;
		case NumberFilterCondition.DOES_NOT_EXIST:
			return propertyValue === null;
		default:
			throw new Error(`Number filter condition not supported: ${condition}`);
	}
};

export const doesCheckboxMatchFilter = (
	condition: CheckboxFilterCondition,
	propertyValue: boolean | null,
	compare: boolean,
) => {
	switch (condition) {
		case CheckboxFilterCondition.IS:
			if (propertyValue === null) return false;
			return propertyValue === compare;
		case CheckboxFilterCondition.IS_NOT:
			if (propertyValue === null) return false;
			return propertyValue !== compare;
		// case CheckboxFilterCondition.IS_EMPTY:
		// 	return propertyValue === null;
		// case CheckboxFilterCondition.IS_NOT_EMPTY:
		// 	return propertyValue !== null;
		case CheckboxFilterCondition.EXISTS:
			return propertyValue !== null;
		case CheckboxFilterCondition.DOES_NOT_EXIST:
			return propertyValue === null;
		default:
			throw new Error(`Checkbox filter condition not supported: ${condition}`);
	}
}
