import { TextFilterCondition } from "src/types";

export const matchTextFilter = (
	propertyValue: string | null,
	compare: string,
	condition: TextFilterCondition,
	matchIfNull: boolean
): boolean => {
	if (propertyValue) {
		console.assert(propertyValue === propertyValue.toLowerCase(), `TextFilter propertyValue ${propertyValue} must be lowercase`);
		console.assert(/^\s/.test(propertyValue) === false, `TextFilter propertyValue ${propertyValue} must not contain whitespace`);
		console.assert(/\s$/.test(propertyValue) === false, `TextFilter propertyValue ${propertyValue} must not contain whitespace`);
	}
	console.assert(compare === compare.toLowerCase(), `TextFilter compare ${compare} must be lowercase`);
	console.assert(/^\s/.test(compare) === false, `TextFilter compare ${compare} must not contain whitespace`);
	console.assert(/\s$/.test(compare) === false, `TextFilter compare ${compare} must not contain whitespace`);

	switch (condition) {
		case TextFilterCondition.IS:
			if (propertyValue === null) return matchIfNull;
			if (compare.length === 0) return true;
			return propertyValue === compare;

		case TextFilterCondition.IS_NOT:
			if (propertyValue === null) return matchIfNull;
			if (compare.length === 0) return true;
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
