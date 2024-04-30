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
	{/if}
	<IconButton
		ariaLabel="Add filter"
		iconId="plus"
		on:click={handleAddFilterClick}
	/>
</Stack>
