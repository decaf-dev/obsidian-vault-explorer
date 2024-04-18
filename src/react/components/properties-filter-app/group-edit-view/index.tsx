import {
	PropertyFilterGroup,
	TextFilterCondition,
	TextPropertyFilter,
} from "src/types";
import IconButton from "../../shared/icon-button";
import Stack from "../../shared/stack";
import Divider from "../../shared/divider";
import PropertyFilterList from "../property-filter-list";
import { generateUUID } from "src/react/services/uuid";

interface Props {
	selectedGroup: PropertyFilterGroup;
	onBackClick: () => void;
	onGroupsChange: React.Dispatch<React.SetStateAction<PropertyFilterGroup[]>>;
}

export default function GroupEditView({
	selectedGroup,
	onBackClick,
	onGroupsChange,
}: Props) {
	function handleAddPropertyClick() {
		const newFilter: TextPropertyFilter = {
			id: generateUUID(),
			propertyName: "",
			operator: "and",
			isEnabled: true,
			condition: TextFilterCondition.IS,
			value: "",
		};

		onGroupsChange((groups) =>
			groups.map((group) =>
				group.id === selectedGroup.id
					? { ...group, filters: [...group.filters, newFilter] }
					: group
			)
		);
	}

	function handleGroupNameChange(name: string) {
		onGroupsChange((groups) =>
			groups.map((group) =>
				group.id === selectedGroup.id ? { ...group, name } : group
			)
		);
	}

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
					onChange={(e) => handleGroupNameChange(e.target.value)}
				/>
			</Stack>
			<Divider />
			<PropertyFilterList
				selectedGroup={selectedGroup}
				onGroupsChange={onGroupsChange}
			/>
			<IconButton
				ariaLabel="Add filter"
				iconId="plus"
				onClick={handleAddPropertyClick}
			/>
		</Stack>
	);
}
