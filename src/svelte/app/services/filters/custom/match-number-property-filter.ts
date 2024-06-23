import { NumberFilterCondition } from "src/types";

export const matchNumberPropertyFilter = (
	propertyValue: number | null,
	compare: number | null,
	condition: NumberFilterCondition,
	matchIfNull: boolean
) => {
	switch (condition) {
		case NumberFilterCondition.IS_EQUAL:
			if (propertyValue === null) return matchIfNull;
			if (compare === null) return true;
			return propertyValue === compare;

		case NumberFilterCondition.IS_GREATER:
			if (propertyValue === null) return matchIfNull;
			if (compare === null) return true;
			return propertyValue > compare;

		case NumberFilterCondition.IS_GREATER_OR_EQUAL:
			if (propertyValue === null) return matchIfNull;
			if (compare === null) return true;
			return propertyValue >= compare;

		case NumberFilterCondition.IS_LESS:
			if (propertyValue === null) return matchIfNull;
			if (compare === null) return true;
			return propertyValue < compare;

		case NumberFilterCondition.IS_LESS_OR_EQUAL:
			if (propertyValue === null) return matchIfNull;
			if (compare === null) return true;
			return propertyValue <= compare;

		case NumberFilterCondition.IS_NOT_EQUAL:
			if (propertyValue === null) return matchIfNull;
			if (compare === null) return true;
			return propertyValue !== compare;

		case NumberFilterCondition.EXISTS:
			return propertyValue !== null;

		case NumberFilterCondition.DOES_NOT_EXIST:
			return propertyValue === null;

		default:
			throw new Error(`NumberFilterCondition not supported: ${condition}`);
	}
};
