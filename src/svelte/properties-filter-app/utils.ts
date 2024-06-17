import { PropertyType, TextFilterCondition, TextPropertyFilter } from "src/types";
import { generateRandomId } from "../shared/services/random";

export const createPropertyFilter = (): TextPropertyFilter => {
	return {
		id: generateRandomId(),
		type: PropertyType.TEXT,
		propertyName: "",
		operator: "and",
		isEnabled: true,
		condition: TextFilterCondition.IS,
		value: "",
		matchWhenPropertyDNE: false,
	};
}
