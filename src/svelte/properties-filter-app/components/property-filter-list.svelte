<script lang="ts">
	import Stack from "src/svelte/shared/components/stack.svelte";
	import PropertyFilter from "./property-filter.svelte";
	import { PropertyFilter as PropertyFilterType } from "src/types";

	export let filters: PropertyFilterType[] = [];
</script>

<Stack direction="column" spacing="md" width="100%">
	{#each filters as filter (filter.id)}
		<PropertyFilter
			id={filter.id}
			value={filter.value}
			condition={filter.condition}
			propertyName={filter.propertyName}
			isEnabled={filter.isEnabled}
			on:groupChange
			on:filterConditionChange
			on:filterNameChange
			on:filterValueChange
			on:filterToggle
			on:filterDeleteClick
		/>
	{/each}
</Stack>
