import { PropertyFilterGroup } from "src/types";
import IconButton from "../../shared/icon-button";
import Stack from "../../shared/stack";
import Divider from "../../shared/divider";
import PropertyFilterList from "../property-filter-list";

interface Props {
	selectedGroup: PropertyFilterGroup;
	onGroupNameChange: (name: string) => void;
	onAddPropertyClick: () => void;
	onBackClick: () => void;
	onPropertyChange: (id: string, propertyName: string) => void;
	onPropertyDelete: (id: string) => void;
	onPropertyToggle: (id: string) => void;
	onPropertyConditionChange: (id: string, condition: string) => void;
	onPropertyValueChange: (id: string, value: string) => void;
}

export default function GroupEditView({
	selectedGroup,
	onGroupNameChange,
	onAddPropertyClick,
	onBackClick,
	onPropertyChange,
	onPropertyDelete,
	onPropertyToggle,
	onPropertyConditionChange,
	onPropertyValueChange,
}: Props) {
	return (
		<Stack direction="column" align="flex-start" spacing="sm">
			<Stack spacing="sm">
				<IconButton
					ariaLabel="Back"
					iconId="arrow-left"
					onClick={onBackClick}
				/>
				<input
					type="text"
					value={selectedGroup.name}
					onChange={(e) => onGroupNameChange(e.target.value)}
				/>
			</Stack>
			<Divider />
			<PropertyFilterList
				selectedGroup={selectedGroup}
				onPropertyChange={onPropertyChange}
				onPropertyDelete={onPropertyDelete}
				onPropertyToggle={onPropertyToggle}
				onConditionChange={onPropertyConditionChange}
				onValueChange={onPropertyValueChange}
			/>
			<IconButton
				ariaLabel="Add filter"
				iconId="plus"
				onClick={onAddPropertyClick}
			/>
		</Stack>
	);
}
