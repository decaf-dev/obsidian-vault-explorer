<script lang="ts">
	import Divider from "src/svelte/shared/components/divider.svelte";
	import IconButton from "src/svelte/shared/components/icon-button.svelte";
	import Stack from "src/svelte/shared/components/stack.svelte";
	import { generateUUID } from "src/svelte/shared/services/uuid";

	import {
		PropertyFilterGroup,
		TextFilterCondition,
		TextPropertyFilter,
	} from "src/types";
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

	function handleBackClick() {
		dispatch("backClick");
	}
</script>

<Stack direction="column" align="flex-start" spacing="sm">
	<Stack spacing="sm">
		<IconButton
			ariaLabel="Back"
			iconId="arrow-left"
			on:click={handleBackClick}
		/>
		<input
			type="text"
			value={selectedGroup.name}
			on:change={handleGroupNameChange}
		/>
	</Stack>
	<Divider />
	<div class="vault-explorer-property-filter-content">
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
			<Spacer direction="vertical" size="md" />
		{/if}
		<IconButton
			ariaLabel="Add filter"
			iconId="plus"
			on:click={handleAddFilterClick}
		/>
	</div>
</Stack>

<style>
	.vault-explorer-property-filter-content {
		width: 100%;
		overflow: auto;
		padding: 5px;
		/* padding-top: 5px; */
	}
</style>
