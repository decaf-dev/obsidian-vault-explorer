<script lang="ts">
	import {
		CheckboxFilterCondition,
		DateFilterCondition,
		FilterCondition,
		FilterOperator,
		TextFilterCondition,
		DatePropertyFilterValue,
		PropertyType,
		FilterRuleType,
	} from "src/types";
	import { getAllObsidianProperties } from "src/obsidian/utils";

	export let index: number;
	export let id: string;
	export let type: FilterRuleType;
	export let propertyName: string;
	export let propertyType: PropertyType;
	export let operator: FilterOperator;
	export let value: string;
	export let valueData: string | null;
	export let condition: FilterCondition;
	export let isEnabled: boolean;
	export let matchWhenPropertyDNE: boolean;

	let plugin: VaultExplorerPlugin;
	let obsidianProperties: ObsidianProperty[] = [];

	store.plugin.subscribe((p) => {
		plugin = p;
		obsidianProperties = getAllObsidianProperties(plugin.app);
	});

	import { createEventDispatcher } from "svelte";
	import store from "src/svelte/shared/services/store";
	import VaultExplorerPlugin from "src/main";
	import { ObsidianProperty } from "src/obsidian/types";
	import FilterRule from "./filter-rule.svelte";
	import { getDisplayNameForDatePropertyFilterValue } from "../services/display-name-utils";

	const dispatch = createEventDispatcher();

	function handleValueChange(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		dispatch("ruleValueChange", { id, value });
	}

	function handlePropertyTypeChange(e: Event) {
		const value = (e.target as HTMLSelectElement).value as PropertyType;
		dispatch("propertyTypeChange", { id, propertyType: value });
	}

	function handlePropertyNameChange(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		dispatch("propertyNameChange", { id, name: value });
	}

	function handleValueDataChange(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		dispatch("propertyValueDataChange", { id, value });
	}

	function handleMatchWhenDNEChange(e: Event) {
		const value = (e.target as HTMLInputElement).checked;
		dispatch("propertyMatchWhenPropertyDNEChange", {
			id,
			matchWhenDNE: value,
		});
	}

	$: filteredObsidianProperties = obsidianProperties.filter((prop) => {
		if (propertyType === "list") {
			return (
				prop.type === "aliases" ||
				prop.type === "tags" ||
				prop.type === "multitext"
			);
		}
		return prop.type === propertyType;
	});
</script>

<FilterRule
	{index}
	{id}
	{propertyType}
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
	<svelte:fragment slot="before-condition">
		<select value={propertyType} on:change={handlePropertyTypeChange}>
			{#each Object.values(PropertyType) as type}
				<option value={type}>{type}</option>
			{/each}
		</select>
		<select value={propertyName} on:change={handlePropertyNameChange}>
			<option value="">select a property</option>
			{#each filteredObsidianProperties as prop (prop.name)}
				<option value={prop.name}>{prop.name}</option>
			{/each}
		</select>
	</svelte:fragment>
	<svelte:fragment slot="after-condition">
		{#if propertyType === PropertyType.CHECKBOX && condition !== CheckboxFilterCondition.EXISTS && condition !== CheckboxFilterCondition.DOES_NOT_EXIST}
			<select {value} on:change={handleValueChange}>
				<option value="true">true</option>
				<option value="false">false</option>
			</select>
		{/if}
		{#if (propertyType === PropertyType.DATE || propertyType === PropertyType.DATETIME) && condition !== DateFilterCondition.EXISTS && condition !== DateFilterCondition.DOES_NOT_EXIST}
			<select {value} on:change={handleValueChange}>
				{#each Object.values(DatePropertyFilterValue) as value}
					<option {value}>
						{getDisplayNameForDatePropertyFilterValue(value)}
					</option>
				{/each}
			</select>
		{/if}
		{#if propertyType !== PropertyType.CHECKBOX && propertyType !== PropertyType.DATE && propertyType !== PropertyType.DATETIME && condition !== TextFilterCondition.EXISTS && condition !== TextFilterCondition.DOES_NOT_EXIST}
			<input
				type={propertyType === PropertyType.NUMBER ? "number" : "text"}
				placeholder={propertyType === PropertyType.LIST
					? "item1,item2,item3"
					: "value"}
				{value}
				on:change={handleValueChange}
			/>
		{/if}
		{#if (propertyType === PropertyType.DATE || propertyType === PropertyType.DATETIME) && value == DatePropertyFilterValue.CUSTOM && condition !== TextFilterCondition.EXISTS && condition !== TextFilterCondition.DOES_NOT_EXIST}
			<input
				type="date"
				value={valueData}
				on:change={handleValueDataChange}
			/>
		{/if}
		{#if condition !== TextFilterCondition.EXISTS && condition !== TextFilterCondition.DOES_NOT_EXIST}
			<input
				aria-label="Match when property doesn't exist"
				type="checkbox"
				checked={matchWhenPropertyDNE}
				on:change={handleMatchWhenDNEChange}
			/>
		{/if}
	</svelte:fragment>
</FilterRule>
