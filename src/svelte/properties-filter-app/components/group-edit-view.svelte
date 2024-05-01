<script lang="ts">
	import Divider from "src/svelte/shared/components/divider.svelte";
	import IconButton from "src/svelte/shared/components/icon-button.svelte";
	import Stack from "src/svelte/shared/components/stack.svelte";

	import { PropertyFilterGroup } from "src/types";
	import PropertyFilterList from "./property-filter-list.svelte";

	import { createEventDispatcher } from "svelte";
	import { createPropertyFilter } from "../utils";
	import Spacer from "src/svelte/shared/components/spacer.svelte";
	const dispatch = createEventDispatcher();

	export let selectedGroup: PropertyFilterGroup;

	function handleAddFilterClick() {
		const newFilter = createPropertyFilter();
		dispatch("filterAddClick", { filter: newFilter });
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
		{#if selectedGroup.filters.length > 0}
			<PropertyFilterList
				filters={selectedGroup.filters}
				on:groupClick
				on:filterConditionChange
				on:filterTypeChange
				on:filterNameChange
				on:filterValueChange
				on:filterToggle
				on:filterDeleteClick
			/>
			<Spacer direction="vertical" size="sm" />
		{/if}
		<IconButton
			ariaLabel="Add property filter"
			iconId="plus"
			on:click={handleAddFilterClick}
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
