import React from "react";

import BaseView from "./base-view";
import GroupEditView from "./group-edit-view";

import {
	PropertyFilterGroup,
	TextFilterCondition,
	TextPropertyFilter,
} from "src/types";
import { useAppMount } from "../shared/app-mount-provider";
import EventManager from "src/event/event-manager";
import { generateUUID } from "src/react/services/uuid";

export default function PropertiesFilterApp() {
	const [editMenu, setEditMenu] = React.useState(false);
	const [selectedGroupId, setSelectedGroupId] = React.useState("");
	const [groups, setGroups] = React.useState<PropertyFilterGroup[]>([]);

	const { getCurrentSettings, onSettingsChange } = useAppMount();

	const selectedGroup = groups.find((group) => group.id === selectedGroupId);

	const settings = getCurrentSettings();
	React.useLayoutEffect(() => {
		setSelectedGroupId(settings.filters.properties.selectedGroupId);
		setGroups(settings.filters.properties.groups);
	}, []);

	React.useEffect(() => {
		return () => {
			EventManager.getInstance().emit("properties-filter-update");
		};
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
	}, [selectedGroupId, groups]);

	function handleGroupClick(id: string) {
		setSelectedGroupId(id);
	}

	function handleAddPropertyGroupClick() {
		const newGroup: PropertyFilterGroup = {
			id: generateUUID(),
			name: `Group ${groups.length + 1}`,
			filters: [],
			position: groups.length,
			isEnabled: true,
		};

		setSelectedGroupId(newGroup.id);
		setGroups([...groups, newGroup]);
	}

	function handleDeletePropertyGroupClick() {
		const index = groups.findIndex((group) => group.id === selectedGroupId);
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
			{editMenu === false && (
				<BaseView
					selectedGroupId={selectedGroupId}
					groups={groups}
					selectedGroup={selectedGroup}
					onEditClick={() => setEditMenu(true)}
					onGroupClick={handleGroupClick}
					onAddPropertyGroupClick={handleAddPropertyGroupClick}
					onDeletePropertyGroupClick={handleDeletePropertyGroupClick}
					onPropertyGroupToggle={handlePropertyGroupToggle}
				/>
			)}
			{editMenu === true && selectedGroup !== undefined && (
				<GroupEditView
					selectedGroup={selectedGroup}
					onBackClick={() => setEditMenu(false)}
					onGroupsChange={setGroups}
					// onAddPropertyClick={handleAddPropertyFilterClick}
					// onGroupNameChange={handleGroupNameChange}
					// onPropertyChange={handlePropertyChange}
					// onPropertyDelete={handlePropertyDelete}
					// onPropertyToggle={handlePropertyToggle}
					// onPropertyConditionChange={handlePropertyConditionChange}
					// onPropertyValueChange={handlePropertyValueChange}
				/>
			)}
		</div>
	);
}
