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
	import License from "src/svelte/shared/services/license";
	import PremiumLink from "src/svelte/shared/components/premium-link.svelte";
	import PremiumMessage from "src/svelte/shared/components/premium-message.svelte";
	const dispatch = createEventDispatcher();

	let isDeviceRegistered = false;

	License.getInstance()
		.getIsDeviceRegisteredStore()
		.subscribe((isRegistered) => {
			isDeviceRegistered = isRegistered;
		});

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
	on:ruleDuplicateClick
	on:ruleTypeChange
	on:ruleConditionChange
	on:ruleOperatorChange
	on:ruleToggle
>
	<svelte:fragment slot="after-condition">
		{#if condition !== ContentFilterCondition.IS_EMPTY && condition !== ContentFilterCondition.IS_NOT_EMPTY}
			<input
				type="text"
				disabled={!isDeviceRegistered}
				placeholder="value"
				{value}
				on:input={handleValueChange}
			/>
		{/if}
	</svelte:fragment>
	<svelte:fragment slot="after-toggle">
		{#if type === FilterRuleType.CONTENT && !isDeviceRegistered}
			<div>
				<PremiumMessage />
				<PremiumLink />
			</div>
		{/if}
	</svelte:fragment>
</FilterRule>

<style>
</style>
