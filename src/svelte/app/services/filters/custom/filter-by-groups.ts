import { FrontMatterCache } from "obsidian";
import {
	TFilterRule,
	TFilterGroup,
	DatePropertyFilterValue,
	PropertyFilterRule,
	FilterRuleType,
	FileNameFilterRule,
	FolderFilterRule,
	ContentFilterRule,
} from "src/types";
import { loadPropertyValue } from "src/svelte/shared/services/load-property-value";
import { matchTextPropertyFilter } from "./match-text-property-filter";
import { matchCheckboxPropertyFilter } from "./match-checkbox-property-filter";
import { matchListPropertyFilter } from "./match-list-property-filter";
import { matchDatePropertyFilter } from "./match-date-property-filter";
import { matchNumberPropertyFilter } from "./match-number-property-filter";
import {
	getDateDaysAgo,
	getDateDaysAhead,
} from "src/svelte/shared/services/time-utils";
import { matchFileNameFilter } from "./match-file-name-filter";
import { matchContentFilter } from "./match-content-filter";
import { matchFolderFilter } from "./match-folder-filter";
import { removeFrontmatter } from "../../utils/content-utils";

export const filterByGroups = (
	fileName: string,
	filePath: string,
	fileFrontmatter: FrontMatterCache | undefined,
	fileContent: string | null,
	groups: TFilterGroup[]
) => {
	return groups.every((group) => {
		if (!group.isEnabled) return true;
		return filterByGroup(
			fileName,
			filePath,
			fileFrontmatter,
			fileContent,
			group
		);
	});
};

const filterByGroup = (
	fileName: string,
	filePath: string,
	fileFrontmatter: FrontMatterCache | undefined,
	fileContent: string | null,
	group: TFilterGroup
) => {
	let result: boolean | null = null;

	group.rules.forEach((filter, i) => {
		if (!filter.isEnabled) return;

		const doesMatch = filterByRule(
			fileName,
			filePath,
			fileFrontmatter,
			fileContent,
			filter
		);
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
};

const filterByRule = (
	fileName: string,
	filePath: string,
	frontmatter: FrontMatterCache | undefined,
	fileContent: string | null,
	filter: TFilterRule
) => {
	const { type } = filter;

	if (type === FilterRuleType.PROPERTY) {
		return filterByPropertyType(frontmatter, filter);
	} else if (type === FilterRuleType.FILE_NAME) {
		return filterByFileName(fileName, filter);
	} else if (type === FilterRuleType.FOLDER) {
		return filterByFolder(filePath, filter);
	} else if (type === FilterRuleType.CONTENT) {
		return filterByContent(fileContent, filter);
	} else {
		throw new Error(`FilterRuleType not supported: ${type}`);
	}
};

const filterByPropertyType = (
	frontmatter: FrontMatterCache | undefined,
	filter: PropertyFilterRule
): boolean => {
	const {
		condition,
		value,
		type,
		matchWhenPropertyDNE,
		propertyType,
		propertyName,
	} = filter;

	///The property is empty when the user has not chosen a property.
	//We should return true in this case because the filter should not be applied
	//This is different than when the property value is empty or null
	if (propertyName === "") {
		return true;
	}

	if (propertyType === "text") {
		let propertyValue = loadPropertyValue<string>(
			frontmatter,
			propertyName,
			propertyType
		);
		if (propertyValue) {
			propertyValue = propertyValue.toLowerCase().trim();
		}
		const compare = value.toLowerCase().trim();

		const doesMatch = matchTextPropertyFilter(
			propertyValue,
			compare,
			condition,
			matchWhenPropertyDNE
		);
		return doesMatch;
	} else if (propertyType === "number") {
		const propertyValue = loadPropertyValue<number>(
			frontmatter,
			propertyName,
			propertyType
		);
		const compare = parseFloat(value.trim());

		const doesMatch = matchNumberPropertyFilter(
			propertyValue,
			compare,
			condition,
			matchWhenPropertyDNE
		);
		return doesMatch;
	} else if (propertyType === "checkbox") {
		const propertyValue = loadPropertyValue<boolean>(
			frontmatter,
			propertyName,
			propertyType
		);

		let compare = null;
		if (value === "true") {
			compare = true;
		} else if (value === "false") {
			compare = false;
		}

		const doesMatch = matchCheckboxPropertyFilter(
			propertyValue,
			compare,
			condition,
			matchWhenPropertyDNE
		);
		return doesMatch;
	} else if (propertyType === "date" || propertyType === "datetime") {
		const propertyValue = loadPropertyValue<string>(
			frontmatter,
			propertyName,
			propertyType
		);

		const { valueData } = filter;
		let compare = valueData;
		if (value === DatePropertyFilterValue.TODAY) {
			compare = getDateDaysAgo(0);
		} else if (value === DatePropertyFilterValue.YESTERDAY) {
			compare = getDateDaysAgo(1);
		} else if (value === DatePropertyFilterValue.TOMORROW) {
			compare = getDateDaysAhead(1);
		} else if (value === DatePropertyFilterValue.ONE_WEEK_AGO) {
			compare = getDateDaysAgo(7);
		} else if (value === DatePropertyFilterValue.ONE_WEEK_FROM_NOW) {
			compare = getDateDaysAhead(7);
		} else if (value === DatePropertyFilterValue.ONE_MONTH_AGO) {
			compare = getDateDaysAgo(30);
		} else if (value === DatePropertyFilterValue.ONE_MONTH_FROM_NOW) {
			compare = getDateDaysAhead(30);
		}

		const doesMatch = matchDatePropertyFilter(
			propertyValue,
			compare,
			condition,
			matchWhenPropertyDNE
		);
		return doesMatch;
	} else if (propertyType === "list") {
		let propertyValue = loadPropertyValue<string[]>(
			frontmatter,
			propertyName,
			propertyType
		);
		if (propertyValue) {
			propertyValue = propertyValue.map((v) => v.toLowerCase().trim());
		}
		const compare = value
			.trim()
			.split(",")
			.map((v) => v.toLowerCase().trim())
			.filter((v) => v !== "");

		const doesMatch = matchListPropertyFilter(
			propertyValue,
			compare,
			condition,
			matchWhenPropertyDNE
		);
		return doesMatch;
	} else {
		throw new Error(`PropertyFilterType not supported: ${type}`);
	}
};

const filterByFileName = (
	fileName: string,
	filter: FileNameFilterRule
): boolean => {
	const value = fileName.toLowerCase();
	const compare = filter.value.toLowerCase().trim();

	const doesMatch = matchFileNameFilter(value, compare, filter.condition);
	return doesMatch;
};

const filterByFolder = (
	filePath: string,
	filter: FolderFilterRule
): boolean => {
	const { condition, includeSubfolders } = filter;

	let value = filePath.toLowerCase();

	const parts = value.split("/");
	if (parts.length === 1) {
		value = "/";
	} else {
		value = parts.slice(0, parts.length - 1).join("/");
	}

	const compare = filter.value.toLowerCase().trim();

	const doesMatch = matchFolderFilter(value, compare, condition, {
		includeSubfolders,
	});
	return doesMatch;
};

const filterByContent = (
	fileContent: string | null,
	filter: ContentFilterRule
): boolean => {
	//If the file content is null, that means that the file is not a markdown file
	if (fileContent === null) {
		return true;
	}

	let value = removeFrontmatter(fileContent);
	value = value.toLowerCase().trim();

	const compare = filter.value.toLocaleLowerCase().trim();

	const doesMatch = matchContentFilter(value, compare, filter.condition);
	return doesMatch;
};
