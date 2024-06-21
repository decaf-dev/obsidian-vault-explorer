import { ListFilterCondition } from "src/types";

export const matchListFilter = (
	propertyValue: string[] | null,
	compare: string[],
	condition: ListFilterCondition,
	matchIfNull: boolean
) => {
	if (propertyValue) {
		console.assert(propertyValue.every(value => value.length > 0), `ListFilter propertyValue ${propertyValue} must not contain empty strings`);
		console.assert(propertyValue.every(value => value === value.toLowerCase()), `ListFilter propertyValue ${propertyValue} must be lowercase`);
		console.assert(propertyValue.every(value => /^\s/.test(value) === false), `ListFilter propertyValue ${propertyValue} must not contain whitespace`);
		console.assert(propertyValue.every(value => /\s$/.test(value) === false), `ListFilter propertyValue ${propertyValue} must not contain whitespace`);
	}
	console.assert(compare.every(value => value === value.toLowerCase()), `ListFilter compare ${compare} must be lowercase`);
	console.assert(compare.every(value => /^\s/.test(value) === false), `ListFilter compare ${compare} must not contain whitespace`);
	console.assert(compare.every(value => /\s$/.test(value) === false), `ListFilter compare ${compare} must not contain whitespace`);

	switch (condition) {
		case ListFilterCondition.CONTAINS:
			if (propertyValue === null) return matchIfNull;
			return compare.every((c) =>
				propertyValue.some((value) => value.includes(c))
			);

		case ListFilterCondition.DOES_NOT_CONTAIN:
			if (propertyValue === null) return matchIfNull;
			return compare.every((c) =>
				propertyValue.every((value) => !value.includes(c))
			);

		case ListFilterCondition.EXISTS:
			return propertyValue !== null;

		case ListFilterCondition.DOES_NOT_EXIST:
			return propertyValue === null;

		default:
			throw new Error(`List filter condition not supported: ${condition}`);
	}
}
