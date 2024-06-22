<script lang="ts">
	import Divider from "src/svelte/shared/components/divider.svelte";
	import IconButton from "src/svelte/shared/components/icon-button.svelte";
	import Stack from "src/svelte/shared/components/stack.svelte";

	import { FilterGroup } from "src/types";
	import FilterRuleList from "./filter-rule-list.svelte";

	import { createEventDispatcher } from "svelte";
	import { createPropertyFilter } from "../utils";
	import Spacer from "src/svelte/shared/components/spacer.svelte";
	const dispatch = createEventDispatcher();

	export let selectedGroup: FilterGroup;

	function handleFilterAddClick() {
		const newFilter = createPropertyFilter();
		dispatch("ruleAddClick", { filter: newFilter });
	}

	function handleGroupNameChange(e: Event) {
		const name = (e.target as HTMLInputElement).value;
		dispatch("groupNameChange", { name });
	}
</script>

<Stack width="100%" direction="column" align="flex-start" spacing="sm">
	<div class="vault-explorer-group-edit-view__header">
		<input
			type="text"
			value={selectedGroup.name}
			on:change={handleGroupNameChange}
		/>
	</div>
	<Divider borderWidth="1px" />
	<div class="vault-explorer-group-edit-view__body">
		{#if selectedGroup.rules.length > 0}
			<FilterRuleList
				rules={selectedGroup.rules}
				on:ruleTypeChange
				on:ruleConditionChange
				on:ruleOperatorChange
				on:ruleValueChange
				on:ruleValueChange
				on:ruleToggle
				on:ruleDeleteClick
				on:propertyTypeChange
				on:propertyNameChange
				on:propertyMatchWhenPropertyDNEChange
				on:propertyValueDataChange
			/>
			<Spacer direction="vertical" size="sm" />
		{/if}
		<IconButton
			ariaLabel="Add filter rule"
			iconId="plus"
			on:click={handleFilterAddClick}
		/>
	</div>
</Stack>

<style>
	.vault-explorer-group-edit-view__header {
		padding: 5px 10px;
	}

	.vault-explorer-group-edit-view__body {
		padding: 5px 10px;
		overflow-y: auto;
		max-height: 200px;
	}
</style>
