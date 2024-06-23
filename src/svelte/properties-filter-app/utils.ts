import { FilterRuleType, PropertyType, TextFilterCondition, TextPropertyFilterRule } from "src/types";
import { generateRandomId } from "../shared/services/random";

export const createPropertyFilter = (): TextPropertyFilterRule => {
	return {
		id: generateRandomId(),
		type: FilterRuleType.PROPERTY,
		propertyType: PropertyType.TEXT,
		propertyName: "",
		operator: "and",
		isEnabled: true,
		condition: TextFilterCondition.IS,
		value: "",
		matchWhenPropertyDNE: false,
	};
}
