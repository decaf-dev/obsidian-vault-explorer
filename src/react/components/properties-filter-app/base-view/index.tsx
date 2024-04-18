import { PropertyFilterGroup } from "src/types";
import Divider from "../../shared/divider";
import Flex from "../../shared/flex";
import IconButton from "../../shared/icon-button";
import Stack from "../../shared/stack";
import Switch from "../../shared/switch";
import GroupTagList from "../group-tag-list";

interface Props {
	selectedGroupId: string;
	groups: PropertyFilterGroup[];
	selectedGroup: PropertyFilterGroup | undefined;
	onEditClick: () => void;
	onGroupClick: (id: string) => void;
	onAddPropertyGroupClick: () => void;
	onDeletePropertyGroupClick: () => void;
	onPropertyGroupToggle: () => void;
}

export default function BaseView({
	selectedGroupId,
	groups,
	selectedGroup,
	onEditClick,
	onGroupClick: handleGroupClick,
	onAddPropertyGroupClick: handleAddPropertyGroupClick,
	onDeletePropertyGroupClick: handleDeletePropertyGroupClick,
	onPropertyGroupToggle: handlePropertyGroupToggle,
}: Props) {
	return (
		<div>
			<Stack direction="column" spacing="sm">
				<GroupTagList
					groups={groups}
					selectedGroupId={selectedGroupId}
					onGroupClick={handleGroupClick}
				/>
				<Flex>
					<IconButton
						ariaLabel="Add property filter group"
						iconId="plus"
						onClick={handleAddPropertyGroupClick}
					/>
				</Flex>
				<Divider />
			</Stack>
			{selectedGroup !== undefined && (
				<Stack align="center">
					<IconButton
						ariaLabel="Edit property filter group"
						iconId="pencil"
						onClick={() => onEditClick()}
					/>
					<IconButton
						ariaLabel="Delete property filter group"
						iconId="trash"
						onClick={handleDeletePropertyGroupClick}
					/>
					<Flex justify="flex-end">
						<Switch
							ariaLabel="Toggle property filter group"
							value={selectedGroup.isEnabled}
							onToggle={handlePropertyGroupToggle}
						/>
					</Flex>
				</Stack>
			)}
		</div>
	);
}
