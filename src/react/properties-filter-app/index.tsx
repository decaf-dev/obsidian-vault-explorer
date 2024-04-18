import React from "react";
import { useAppMount } from "../app-mount-provider";
import GroupTagList from "./group-tag-list";
import { PropertyFilterGroup } from "src/types";
import IconButton from "../shared/icon-button";
import Flex from "../shared/flex";
import Stack from "../shared/stack";
import Divider from "../shared/divider";
import Switch from "../shared/switch";
import { useAppSelector } from "src/redux/hooks";

export default function PropertiesFilterApp() {
	const [selectedGroupId, setSelectedGroupId] = React.useState("");
	const [groups, setGroups] = React.useState<PropertyFilterGroup[]>([]);

	const { onSettingsChange } = useAppMount();
	const { settings } = useAppSelector((state) => state.global);

	const selectedGroup = groups.find((group) => group.id === selectedGroupId);

	console.log("properties filter", settings.filters.properties);

	React.useLayoutEffect(() => {
		setSelectedGroupId(settings.filters.properties.selectedGroupId);
		setGroups(settings.filters.properties.groups);
	}, []);

	React.useEffect(() => {
		onSettingsChange({
			...settings,
			filters: {
				...settings.filters,
				properties: {
					selectedGroupId,
					groups,
				},
			},
		});
	}, [onSettingsChange, selectedGroupId, groups]);

	function handleGroupClick(id: string) {
		setSelectedGroupId(id);
	}

	function handleAddPropertyGroupClick() {
		const newGroup: PropertyFilterGroup = {
			id: Math.random().toString(),
			name: `Group ${groups.length + 1}`,
			filters: [],
			position: groups.length,
			isEnabled: true,
		};

		setSelectedGroupId(newGroup.id);
		setGroups([...groups, newGroup]);
	}

	function handleDeletePropertyGroupClick() {
		if (confirm("Are you sure you want to delete this group?")) {
			const index = groups.findIndex(
				(group) => group.id === selectedGroupId
			);
			const newGroups = groups.filter(
				(group) => group.id !== selectedGroupId
			);

			let newIndex = index - 1;
			if (newIndex < 0) {
				newIndex = 0;
			}

			setGroups(newGroups);

			if (newGroups.length === 0) {
				setSelectedGroupId("");
			} else {
				setSelectedGroupId(newGroups[newIndex].id);
			}
		}
	}

	function handlePropertyGroupToggle() {
		const newGroups = groups.map((group) =>
			group.id === selectedGroupId
				? { ...group, isEnabled: !group.isEnabled }
				: group
		);

		setGroups(newGroups);
	}

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
						onClick={() => {}}
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
