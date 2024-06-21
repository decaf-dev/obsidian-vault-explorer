import { FilterRuleType, TextFilterCondition, TextPropertyFilter } from "src/types";
import { generateRandomId } from "../shared/services/random";

export const createPropertyFilter = (): TextPropertyFilter => {
	return {
		id: generateRandomId(),
		type: FilterRuleType.TEXT,
		propertyName: "",
		operator: "and",
		isEnabled: true,
		condition: TextFilterCondition.IS,
		value: "",
		matchWhenPropertyDNE: false,
	};
}
