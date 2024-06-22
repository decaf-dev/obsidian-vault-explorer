import { ListFilterCondition } from "src/types";

export const matchListPropertyFilter = (
	propertyValue: string[] | null,
	compare: string[],
	condition: ListFilterCondition,
	matchIfNull: boolean
) => {
	if (propertyValue) {
		console.assert(propertyValue.every(value => value.length > 0), `ListPropertyFilter propertyValue "${propertyValue}" must not contain empty strings`);
		console.assert(propertyValue.every(value => value === value.toLowerCase()), `ListPropertyFilter propertyValue "${propertyValue}" must be lowercase`);
		console.assert(propertyValue.every(value => /^\s/.test(value) === false), `ListPropertyFilter propertyValue "${propertyValue}" must not contain whitespace`);
		console.assert(propertyValue.every(value => /\s$/.test(value) === false), `ListPropertyFilter propertyValue "${propertyValue}" must not contain whitespace`);
	}
	console.assert(compare.every(value => value === value.toLowerCase()), `ListPropertyFilter compare "${compare}" must be lowercase`);
	console.assert(compare.every(value => /^\s/.test(value) === false), `ListPropertyFilter compare "${compare}" must not contain whitespace`);
	console.assert(compare.every(value => /\s$/.test(value) === false), `ListPropertyFilter compare "${compare}" must not contain whitespace`);

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
			throw new Error(`ListFilterCondition not supported: ${condition}`);
	}
}
