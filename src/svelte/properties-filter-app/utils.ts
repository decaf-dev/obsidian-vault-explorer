import { TextFilterCondition, TextPropertyFilter } from "src/types";
import { generateUUID } from "../shared/services/uuid";

export const createPropertyFilter = (): TextPropertyFilter => {
	return {
		id: generateUUID(),
		propertyName: "",
		operator: "and",
		isEnabled: true,
		condition: TextFilterCondition.IS,
		value: "",
	};
}