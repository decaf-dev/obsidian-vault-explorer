<script lang="ts">
	import Stack from "src/svelte/shared/components/stack.svelte";
	import PropertyFilter from "./property-filter.svelte";
	import { PropertyFilter as PropertyFilterType } from "src/types";

	export let filters: PropertyFilterType[] = [];
</script>

<Stack direction="column" spacing="md" width="100%">
	{#each filters as filter, index (filter.id)}
		<PropertyFilter
			{index}
			id={filter.id}
			operator={filter.operator}
			value={filter.value}
			condition={filter.condition}
			matchWhenPropertyDNE={filter.matchWhenPropertyDNE}
			type={filter.type}
			propertyName={filter.propertyName}
			isEnabled={filter.isEnabled}
			on:groupChange
			on:filterConditionChange
			on:filterTypeChange
			on:filterOperatorChange
			on:filterPropertyNameChange
			on:filterValueChange
			on:filterToggle
			on:filterDeleteClick
			on:filterMatchWhenPropertyDNEChange
		/>
	{/each}
</Stack>
