import { CheckboxFilterCondition } from "src/types";

export const matchCheckboxPropertyFilter = (
	propertyValue: boolean | null,
	compare: boolean | null,
	condition: CheckboxFilterCondition,
	matchIfNull: boolean
) => {
	switch (condition) {
		case CheckboxFilterCondition.IS:
			if (propertyValue === null) return matchIfNull;
			if (compare === null) return true;
			return propertyValue === compare;

		case CheckboxFilterCondition.IS_NOT:
			if (propertyValue === null) return matchIfNull;
			if (compare === null) return true;
			return propertyValue !== compare;

		case CheckboxFilterCondition.EXISTS:
			return propertyValue !== null;

		case CheckboxFilterCondition.DOES_NOT_EXIST:
			return propertyValue === null;

		default:
			throw new Error(`CheckboxFilterCondition not supported: ${condition}`);
	}
}
