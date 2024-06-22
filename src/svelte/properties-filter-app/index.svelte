<script lang="ts">
	import EventManager from "src/event/event-manager";
	import { onMount } from "svelte";
	import store from "../shared/services/store";
	import VaultExplorerPlugin from "src/main";
	import {
		CheckboxFilterCondition,
		DateFilterCondition,
		ListFilterCondition,
		NumberFilterCondition,
		FilterGroup,
		TextFilterCondition,
		DatePropertyFilterValue,
		PropertyType,
		FilterRuleType,
	} from "src/types";
	import { generateRandomId } from "../shared/services/random";
	import GroupEditView from "./components/group-edit-view.svelte";
	import { createPropertyFilter } from "./utils";
	import GroupList from "./components/group-list.svelte";
	import Flex from "../shared/components/flex.svelte";
	import Divider from "../shared/components/divider.svelte";

	let selectedGroupId: string = "";
	let groups: FilterGroup[] = [];
	let plugin: VaultExplorerPlugin;

	$: selectedGroup = groups.find((group) => group.id === selectedGroupId);

	$: groups, selectedGroupId, saveSettings();

	async function saveSettings() {
		plugin.settings.filters.custom.groups = groups;
		plugin.settings.filters.custom.selectedGroupId = selectedGroupId;
		await plugin.saveSettings();
	}

	store.plugin.subscribe((p) => {
		plugin = p;

		groups = plugin.settings.filters.custom.groups;
		selectedGroupId = plugin.settings.filters.custom.selectedGroupId;
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

	function handleGroupAddClick() {
		const newGroup: FilterGroup = {
			id: generateRandomId(),
			name: `Group ${groups.length + 1}`,
			rules: [createPropertyFilter()],
			isEnabled: groups.length === 0,
		};

		selectedGroupId = newGroup.id;
		groups = [...groups, newGroup];
	}

	function handleGroupDeleteClick() {
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

	function handleRuleAddClick(e: CustomEvent) {
		const { filter } = e.detail;

		const newGroups = groups.map((group) =>
			group.id === selectedGroupId
				? { ...group, rules: [...group.rules, filter] }
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

	function handlePropertyFilterConditionChange(e: CustomEvent) {
		const { id, condition } = e.detail;

		const newGroups = groups.map((group) =>
			group.id === selectedGroupId
				? {
						...group,
						rules: group.rules.map((rule) =>
							rule.id === id ? { ...rule, condition } : rule,
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

	function handlePropertyFilterDeleteClick(e: CustomEvent) {
		const { id } = e.detail;

		const newGroups = groups.map((group) =>
			group.id === selectedGroupId
				? {
						...group,
						rules: group.rules.filter((rule) => rule.id !== id),
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
						rules: group.rules.map((rule) =>
							rule.id === id
								? { ...rule, propertyName: name }
								: rule,
						),
					}
				: group,
		);

		groups = newGroups;
	}

	function handleRuleToggle(e: CustomEvent) {
		const { id } = e.detail;

		const newGroups = groups.map((group) =>
			group.id === selectedGroupId
				? {
						...group,
						rules: group.rules.map((rule) =>
							rule.id === id
								? { ...rule, isEnabled: !rule.isEnabled }
								: rule,
						),
					}
				: group,
		);

		groups = newGroups;
	}

	function handleRuleOperatorChange(e: CustomEvent) {
		const { id, operator } = e.detail;

		const newGroups = groups.map((group) =>
			group.id === selectedGroupId
				? {
						...group,
						rules: group.rules.map((rule) =>
							rule.id === id ? { ...rule, operator } : rule,
						),
					}
				: group,
		);

		groups = newGroups;
	}

	function handlePropertyFilterTypeChange(e: CustomEvent) {
		const { id, propertyType } = e.detail;

		let newCondition: any;
		let newValue = "";
		if (propertyType === "text") {
			newCondition = TextFilterCondition.IS;
		} else if (propertyType === "number") {
			newCondition = NumberFilterCondition.IS_EQUAL;
		} else if (propertyType === "checkbox") {
			newCondition = CheckboxFilterCondition.IS;
			newValue = "true";
		} else if (propertyType === "list") {
			newCondition = ListFilterCondition.CONTAINS;
		} else if (propertyType === "date" || propertyType === "datetime") {
			newValue = DatePropertyFilterValue.TODAY;
			newCondition = DateFilterCondition.IS;
		} else {
			throw new Error(`Unhandled filter type: ${propertyType}`);
		}

		const newGroups: FilterGroup[] = groups.map((group) =>
			group.id === selectedGroupId
				? {
						...group,
						rules: group.rules.map((rule) =>
							rule.id === id
								? {
										...rule,
										propertyType,
										propertyName: "",
										condition: newCondition,
										value: newValue,
										...(propertyType ===
											PropertyType.DATE ||
										propertyType === PropertyType.DATETIME
											? { valueData: "" }
											: {}),
									}
								: rule,
						),
					}
				: group,
		);

		groups = newGroups;
	}

	function handlePropertyFilterValueChange(e: CustomEvent) {
		const { id, value } = e.detail;

		const newGroups: FilterGroup[] = groups.map((group) => {
			const { rules } = group;
			if (group.id === selectedGroupId) {
				const newRules = rules.map((rule) => {
					if (rule.id === id) {
						return {
							...rule,
							value,
							...(rule.type === FilterRuleType.PROPERTY &&
							(rule.propertyType === PropertyType.DATE ||
								rule.propertyType) === PropertyType.DATETIME
								? { valueData: "" }
								: {}),
						};
					}
					return rule;
				});
				return {
					...group,
					rules: newRules,
				};
			}
			return group;
		});

		groups = newGroups;
	}

	function handlePropertyFilterValueDataChange(e: CustomEvent) {
		const { id, value } = e.detail;

		const newGroups = groups.map((group) =>
			group.id === selectedGroupId
				? {
						...group,
						rules: group.rules.map((rule) =>
							rule.id === id
								? { ...rule, valueData: value }
								: rule,
						),
					}
				: group,
		);

		groups = newGroups;
	}

	function handlePropertyFilterMatchWhenPropertyDNEChange(e: CustomEvent) {
		const { id, matchWhenDNE } = e.detail;

		const newGroups: FilterGroup[] = groups.map((group) =>
			group.id === selectedGroupId
				? {
						...group,
						rules: group.rules.map((rule) =>
							rule.id === id
								? {
										...rule,
										matchWhenPropertyDNE: matchWhenDNE,
									}
								: rule,
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
			on:groupAddClick={handleGroupAddClick}
			on:groupDeleteClick={handleGroupDeleteClick}
		/>
		<Divider direction="vertical" />
		{#if selectedGroup !== undefined}
			<GroupEditView
				{selectedGroup}
				on:groupNameChange={handleGroupNameChange}
				on:ruleAddClick={handleRuleAddClick}
				on:filterPropertyTypeChange={handlePropertyFilterTypeChange}
				on:filterConditionChange={handlePropertyFilterConditionChange}
				on:filterDeleteClick={handlePropertyFilterDeleteClick}
				on:filterPropertyNameChange={handleFilterPropertyNameChange}
				on:ruleToggle={handleRuleToggle}
				on:filterOperatorChange={handleRuleOperatorChange}
				on:filterValueChange={handlePropertyFilterValueChange}
				on:filterValueDataChange={handlePropertyFilterValueDataChange}
				on:filterMatchWhenPropertyDNEChange={handlePropertyFilterMatchWhenPropertyDNEChange}
			/>
		{/if}
	</Flex>
</div>

<style>
	.vault-explorer-property-filter-app {
		height: 255px;
	}
</style>
