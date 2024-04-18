import { PropertyFilterGroup } from "src/types";
import Stack from "../../shared/stack";
import PropertyFilter from "../property-filter";

interface Props {
	selectedGroup: PropertyFilterGroup;
	onPropertyChange: (id: string, propertyName: string) => void;
	onPropertyDelete: (id: string) => void;
	onPropertyToggle: (id: string) => void;
	onConditionChange: (id: string, condition: string) => void;
	onValueChange: (id: string, value: string) => void;
}

export default function PropertyFilterList({
	selectedGroup,
	onPropertyChange,
	onPropertyDelete,
	onPropertyToggle,
	onConditionChange,
	onValueChange,
}: Props) {
	return (
		<Stack direction="column" spacing="md" width="100%">
			{selectedGroup.filters.map((filter) => {
				const { id, isEnabled, propertyName, condition, value } =
					filter;
				return (
					<PropertyFilter
						key={id}
						id={id}
						value={value}
						condition={condition}
						propertyName={propertyName}
						isEnabled={isEnabled}
						onPropertyChange={onPropertyChange}
						onDelete={onPropertyDelete}
						onToggle={onPropertyToggle}
						onConditionChange={onConditionChange}
						onValueChange={onValueChange}
					/>
				);
			})}
		</Stack>
	);
}
