<script lang="ts">
	import EventManager from "src/event/event-manager";
	import { onMount } from "svelte";
	import store from "../shared/services/store";
	import VaultExplorerPlugin from "src/main";
	import {
		CheckboxFilterCondition,
		DateFilterCondition,
		FilterCondition,
		ListFilterCondition,
		NumberFilterCondition,
		PropertyFilterGroup,
		TextFilterCondition,
	} from "src/types";
	import { generateUUID } from "../shared/services/uuid";
	import GroupEditView from "./components/group-edit-view.svelte";
	import { createPropertyFilter } from "./utils";
	import GroupList from "./components/group-list.svelte";
	import Flex from "../shared/components/flex.svelte";
	import Divider from "../shared/components/divider.svelte";
	import { match } from "assert";

	let selectedGroupId: string = "";
	let groups: PropertyFilterGroup[] = [];
	let plugin: VaultExplorerPlugin;

	$: selectedGroup = groups.find((group) => group.id === selectedGroupId);

	$: groups, selectedGroupId, saveSettings();

	async function saveSettings() {
		plugin.settings.filters.properties.groups = groups;
		plugin.settings.filters.properties.selectedGroupId = selectedGroupId;
		await plugin.saveSettings();
	}

	store.plugin.subscribe((p) => {
		plugin = p;

		groups = plugin.settings.filters.properties.groups;
		selectedGroupId = plugin.settings.filters.properties.selectedGroupId;
	});

	onMount(() => {
		return () => {
			EventManager.getInstance().emit("properties-filter-update");
		};
	});

	function handleGroupClick(e: CustomEvent) {
		const { id } = e.detail;
		selectedGroupId = id;
	}

	function handleAddGroupClick() {
		const newGroup: PropertyFilterGroup = {
			id: generateUUID(),
			name: `Group ${groups.length + 1}`,
			filters: [createPropertyFilter()],
			isEnabled: groups.length === 0,
		};

		selectedGroupId = newGroup.id;
		groups = [...groups, newGroup];
	}

	function handleDeleteGroupClick() {
		const index = groups.findIndex((group) => group.id === selectedGroupId);
		const newGroups = groups.filter(
			(group) => group.id !== selectedGroupId,
		);

		let newIndex = index - 1;
		if (newIndex < 0) {
			newIndex = 0;
		}

		groups = newGroups;

		if (newGroups.length === 0) {
			selectedGroupId = "";
		} else {
			selectedGroupId = newGroups[newIndex].id;
		}
	}

	function handleFilterAddClick(e: CustomEvent) {
		const { filter } = e.detail;

		const newGroups = groups.map((group) =>
			group.id === selectedGroupId
				? { ...group, filters: [...group.filters, filter] }
				: group,
		);

		groups = newGroups;
	}

	function handleGroupNameChange(e: CustomEvent) {
		const { name } = e.detail;

		const newGroups = groups.map((group) =>
			group.id === selectedGroupId ? { ...group, name } : group,
		);

		groups = newGroups;
	}

	function handleGroupToggle() {
		const newGroups = groups.map((group) =>
			group.id === selectedGroupId
				? { ...group, isEnabled: !group.isEnabled }
				: { ...group, isEnabled: false },
		);

		groups = newGroups;
	}

	function handleFilterConditionChange(e: CustomEvent) {
		const { id, condition } = e.detail;

		const newGroups = groups.map((group) =>
			group.id === selectedGroupId
				? {
						...group,
						filters: group.filters.map((filter) =>
							filter.id === id
								? { ...filter, condition }
								: filter,
						),
					}
				: group,
		);

		groups = newGroups;
	}

	function handleGroupDragStart(e: CustomEvent) {
		const { nativeEvent, id } = e.detail;

		nativeEvent.dataTransfer.setData("text", id);
		nativeEvent.dataTransfer.effectAllowed = "move";
	}

	function handleGroupDragOver(e: CustomEvent) {
		const { nativeEvent } = e.detail;

		nativeEvent.preventDefault();
	}

	function handleGroupDrop(e: CustomEvent) {
		const { id, nativeEvent } = e.detail;
		const dragId = nativeEvent.dataTransfer.getData("text");
		nativeEvent.dataTransfer.dropEffect = "move";

		const draggedIndex = groups.findIndex((group) => group.id === dragId);
		const dragged = groups.find((group) => group.id === dragId);

		const droppedIndex = groups.findIndex((group) => group.id === id);

		if (!dragged || draggedIndex === -1 || droppedIndex === -1) return;

		let newGroups = [...groups];

		// Remove the dragged item
		newGroups.splice(draggedIndex, 1);

		// Insert the dragged item at the drop index
		newGroups.splice(droppedIndex, 0, dragged);

		groups = newGroups;
	}

	function handleFilterDeleteClick(e: CustomEvent) {
		const { id } = e.detail;

		const newGroups = groups.map((group) =>
			group.id === selectedGroupId
				? {
						...group,
						filters: group.filters.filter(
							(filter) => filter.id !== id,
						),
					}
				: group,
		);

		groups = newGroups;
	}

	function handleFilterPropertyNameChange(e: CustomEvent) {
		const { id, name } = e.detail;

		const newGroups = groups.map((group) =>
			group.id === selectedGroupId
				? {
						...group,
						filters: group.filters.map((filter) =>
							filter.id === id
								? { ...filter, propertyName: name }
								: filter,
						),
					}
				: group,
		);

		groups = newGroups;
	}

	function handleFilterToggle(e: CustomEvent) {
		const { id } = e.detail;

		const newGroups = groups.map((group) =>
			group.id === selectedGroupId
				? {
						...group,
						filters: group.filters.map((filter) =>
							filter.id === id
								? { ...filter, isEnabled: !filter.isEnabled }
								: filter,
						),
					}
				: group,
		);

		groups = newGroups;
	}

	function handleFilterTypeChange(e: CustomEvent) {
		const { id, type } = e.detail;

		let condition: FilterCondition;
		if (type === "text") {
			condition = TextFilterCondition.IS;
		} else if (type === "number") {
			condition = NumberFilterCondition.IS_EQUAL;
		} else if (type === "checkbox") {
			condition = CheckboxFilterCondition.IS;
		} else if (type === "list") {
			condition = ListFilterCondition.CONTAINS;
		} else if (type === "date" || type === "datetime") {
			condition = DateFilterCondition.IS;
		} else {
			throw new Error(`Unhandled filter type: ${type}`);
		}

		const newGroups: PropertyFilterGroup[] = groups.map((group) =>
			group.id === selectedGroupId
				? {
						...group,
						filters: group.filters.map((filter) =>
							filter.id === id
								? {
										...filter,
										type,
										name: "",
										condition,
										value: "",
									}
								: filter,
						),
					}
				: group,
		);

		groups = newGroups;
	}

	function handleFilterValueChange(e: CustomEvent) {
		const { id, value } = e.detail;

		const newGroups = groups.map((group) =>
			group.id === selectedGroupId
				? {
						...group,
						filters: group.filters.map((filter) =>
							filter.id === id ? { ...filter, value } : filter,
						),
					}
				: group,
		);

		groups = newGroups;
	}

	function handleFilterMatchWhenPropertyDNEChange(e: CustomEvent) {
		const { id, matchWhenDNE } = e.detail;

		const newGroups = groups.map((group) =>
			group.id === selectedGroupId
				? {
						...group,
						filters: group.filters.map((filter) =>
							filter.id === id
								? {
										...filter,
										matchWhenPropertyDNE: matchWhenDNE,
									}
								: filter,
						),
					}
				: group,
		);

		groups = newGroups;
	}
</script>

<div class="vault-explorer-property-filter-app">
	<Flex align="stretch" height="100%">
		<GroupList
			{groups}
			{selectedGroup}
			on:itemClick={handleGroupClick}
			on:itemDragStart={handleGroupDragStart}
			on:itemDragOver={handleGroupDragOver}
			on:itemDrop={handleGroupDrop}
			on:addGroupClick={handleAddGroupClick}
			on:deleteGroupClick={handleDeleteGroupClick}
		/>
		<Divider direction="vertical" />
		{#if selectedGroup !== undefined}
			<GroupEditView
				{selectedGroup}
				on:groupNameChange={handleGroupNameChange}
				on:filterAddClick={handleFilterAddClick}
				on:filterTypeChange={handleFilterTypeChange}
				on:filterConditionChange={handleFilterConditionChange}
				on:filterDeleteClick={handleFilterDeleteClick}
				on:filterPropertyNameChange={handleFilterPropertyNameChange}
				on:filterToggle={handleFilterToggle}
				on:filterValueChange={handleFilterValueChange}
				on:filterMatchWhenPropertyDNEChange={handleFilterMatchWhenPropertyDNEChange}
			/>
		{/if}
	</Flex>
</div>

<style>
	.vault-explorer-property-filter-app {
		height: 255px;
	}
</style>
