<script lang="ts">
	import Stack from "src/svelte/shared/components/stack.svelte";
	import PropertyFilter from "./property-filter.svelte";
	import { FilterRule, FilterRuleType } from "src/types";

	export let filters: FilterRule[] = [];
</script>

<Stack direction="column" spacing="md" width="100%">
	{#each filters as filter, index (filter.id)}
		<PropertyFilter
			{index}
			id={filter.id}
			{...filter.type === FilterRuleType.TEXT ||
			filter.type === FilterRuleType.NUMBER ||
			filter.type === FilterRuleType.LIST ||
			filter.type === FilterRuleType.CHECKBOX ||
			filter.type === FilterRuleType.DATE ||
			filter.type === FilterRuleType.DATETIME
				? { propertyName: filter.propertyName }
				: { propertyName: null }}
			operator={filter.operator}
			value={filter.value}
			{...filter.type === FilterRuleType.DATE
				? { valueData: filter.valueData }
				: { valueData: null }}
			condition={filter.condition}
			matchWhenPropertyDNE={filter.matchWhenPropertyDNE}
			type={filter.type}
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
