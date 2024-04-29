<script lang="ts">
	import EventManager from "src/event/event-manager";
	import { onMount } from "svelte";
	import store from "../shared/services/store";
	import VaultExplorerPlugin from "src/main";
	import { PropertyFilterGroup } from "src/types";
	import { generateUUID } from "../shared/services/uuid";
	import BaseView from "./components/base-view.svelte";
	import GroupEditView from "./components/group-edit-view.svelte";
	import { createPropertyFilter } from "./utils";

	let editMenu: boolean = false;
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
			position: groups.length,
			isEnabled: false,
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

	function handleFilterNameChange(e: CustomEvent) {
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
</script>

<div>
	{#if editMenu === false}
		<BaseView
			{groups}
			{selectedGroup}
			on:editClick={() => (editMenu = true)}
			on:groupClick={handleGroupClick}
			on:addGroupClick={handleAddGroupClick}
			on:deleteGroupClick={handleDeleteGroupClick}
			on:groupToggle={handleGroupToggle}
			on:groupNameChange={handleGroupNameChange}
			on:filterAddClick={handleFilterAddClick}
			on:groupClick={handleGroupClick}
			on:filterConditionChange={handleFilterConditionChange}
			on:filterDeleteClick={handleFilterDeleteClick}
			on:filterNameChange={handleFilterNameChange}
			on:filterToggle={handleFilterToggle}
			on:filterValueChange={handleFilterValueChange}
		/>
	{/if}
	{#if editMenu === true && selectedGroup !== undefined}
		<GroupEditView
			{selectedGroup}
			on:backClick={() => (editMenu = false)}
			on:groupNameChange={handleGroupNameChange}
			on:filterAddClick={handleFilterAddClick}
			on:groupClick={handleGroupClick}
			on:filterConditionChange={handleFilterConditionChange}
			on:filterDeleteClick={handleFilterDeleteClick}
			on:filterNameChange={handleFilterNameChange}
			on:filterToggle={handleFilterToggle}
			on:filterValueChange={handleFilterValueChange}
		/>
	{/if}
</div>
