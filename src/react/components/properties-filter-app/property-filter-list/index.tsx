import { PropertyFilterGroup } from "src/types";
import Stack from "../../shared/stack";
import PropertyFilter from "../property-filter";

interface Props {
	selectedGroup: PropertyFilterGroup;
	onGroupsChange: React.Dispatch<React.SetStateAction<PropertyFilterGroup[]>>;
}

export default function PropertyFilterList({
	selectedGroup,
	onGroupsChange,
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
						onGroupsChange={onGroupsChange}
					/>
				);
			})}
		</Stack>
	);
}
