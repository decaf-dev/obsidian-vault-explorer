<script lang="ts">
	import {
		ContentFilterCondition,
		FilterCondition,
		FilterOperator,
		FilterRuleType,
	} from "src/types";
	import FilterRule from "./filter-rule.svelte";

	export let index: number;
	export let id: string;
	export let type: FilterRuleType;
	export let value: string;
	export let operator: FilterOperator;
	export let condition: FilterCondition;
	export let isEnabled: boolean;

	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();

	function handleValueChange(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		dispatch("ruleValueChange", { id, value });
	}
</script>

<FilterRule
	propertyType={null}
	{index}
	{id}
	{type}
	{operator}
	{condition}
	{isEnabled}
	on:ruleDeleteClick
	on:ruleTypeChange
	on:ruleConditionChange
	on:ruleOperatorChange
	on:ruleToggle
>
	<svelte:fragment slot="after-condition">
		{#if condition !== ContentFilterCondition.IS_EMPTY && condition !== ContentFilterCondition.IS_NOT_EMPTY}
			<input
				type="text"
				placeholder="value"
				{value}
				on:input={handleValueChange}
			/>
		{/if}
	</svelte:fragment>
</FilterRule>
