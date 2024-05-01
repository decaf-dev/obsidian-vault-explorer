<script lang="ts">
	import IconButton from "src/svelte/shared/components/icon-button.svelte";
	import Stack from "src/svelte/shared/components/stack.svelte";
	import Switch from "src/svelte/shared/components/switch.svelte";
	import {
		CheckboxFilterCondition,
		DateFilterCondition,
		FilterCondition,
		ListFilterCondition,
		NumberFilterCondition,
		PropertyFilterType,
		TextFilterCondition,
	} from "src/types";
	import { getDisplayNameForFilterCondition } from "./utils";
	import { getAllObsidianProperties } from "src/obsidian/utils";

	export let id: string;
	export let name: string;
	export let type: PropertyFilterType;
	export let value: string;
	export let condition: FilterCondition;
	export let isEnabled: boolean;

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
	import Wrap from "src/svelte/shared/components/wrap.svelte";
	const dispatch = createEventDispatcher();

	function handleDeleteClick() {
		dispatch("filterDeleteClick", { id });
	}

	function handlePropertyNameChange(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		dispatch("filterNameChange", { id, name: value });
	}

	function handlePropertyTypeChange(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		dispatch("filterTypeChange", { id, type: value });
	}

	function handleConditionChange(e: Event) {
		const value = (e.target as HTMLSelectElement).value;
		dispatch("filterConditionChange", { id, condition: value });
	}

	function handleValueChange(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		dispatch("filterValueChange", { id, value });
	}

	function handleToggle() {
		dispatch("filterToggle", { id });
	}

	$: filterConditions = findFilterConditions(type);

	$: filteredObsidianProperties = obsidianProperties.filter((prop) => {
		if (type === "list") {
			return (
				prop.type === "aliases" ||
				prop.type === "tags" ||
				prop.type === "multitext"
			);
		}
		return prop.type === type;
	});

	function findFilterConditions(type: PropertyFilterType): FilterCondition[] {
		if (type === "text") {
			return Object.values(TextFilterCondition);
		} else if (type === "number") {
			return Object.values(NumberFilterCondition);
		} else if (type === "list") {
			return Object.values(ListFilterCondition);
		} else if (type === "checkbox") {
			return Object.values(CheckboxFilterCondition);
		} else if (type === "date" || type === "datetime") {
			return Object.values(DateFilterCondition);
		} else {
			throw new Error(`Unknown filter type: ${type}`);
		}
	}
</script>

<div class="vault-explorer-property-filter">
	<Wrap spacingX="sm" spacingY="sm">
		<select value={type} on:change={handlePropertyTypeChange}>
			{#each Object.values(PropertyFilterType) as type}
				<option value={type}>{type}</option>
			{/each}
		</select>
		<select value={name} on:change={handlePropertyNameChange}>
			<option value="">Select a property</option>
			{#each filteredObsidianProperties as prop (prop.name)}
				<option value={prop.name}>{prop.name}</option>
			{/each}
		</select>
		<select value={condition} on:change={handleConditionChange}>
			{#each filterConditions as condition}
				<option value={condition}>
					{getDisplayNameForFilterCondition(condition)}
				</option>
			{/each}
		</select>
		{#if condition !== TextFilterCondition.EXISTS && condition !== TextFilterCondition.DOES_NOT_EXIST}
			<input type="text" {value} on:change={handleValueChange} />
		{/if}
		<Stack spacing="sm" align="center">
			<Switch value={isEnabled} on:change={() => handleToggle()} />
			<IconButton
				ariaLabel="Delete property filter"
				iconId="trash"
				on:click={() => handleDeleteClick()}
			/>
		</Stack>
	</Wrap>
</div>

<style>
	.vault-explorer-property-filter input {
		max-width: 100px;
	}

	.vault-explorer-property-filter select {
		max-width: 150px;
	}
</style>
