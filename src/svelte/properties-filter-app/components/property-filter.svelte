<script lang="ts">
	import Flex from "src/svelte/shared/components/flex.svelte";
	import IconButton from "src/svelte/shared/components/icon-button.svelte";
	import Stack from "src/svelte/shared/components/stack.svelte";
	import Switch from "src/svelte/shared/components/switch.svelte";
	import { TextFilterCondition } from "src/types";
	import { getDisplayNameForFilterCondition } from "./utils";
	import { getAllObsidianProperties } from "src/obsidian/utils";

	export let id: string;
	export let propertyName: string;
	export let value: string;
	export let condition: TextFilterCondition;
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
	const dispatch = createEventDispatcher();

	function handleDeleteClick() {
		dispatch("filterDeleteClick", { id });
	}

	function handlePropertyNameChange(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		dispatch("filterNameChange", { id, name: value });
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
</script>

<div class="vault-explorer-property-filter">
	<Flex justify="space-between">
		<Stack spacing="md">
			<select value={propertyName} on:change={handlePropertyNameChange}>
				<option value="">Select a property</option>
				{#each obsidianProperties as prop (prop.name)}
					<option value={prop.name}>{prop.name}</option>
				{/each}
			</select>
			<select value={condition} on:change={handleConditionChange}>
				{#each Object.values(TextFilterCondition) as condition}
					<option value={condition}>
						{getDisplayNameForFilterCondition(condition)}
					</option>
				{/each}
			</select>
			{#if condition !== TextFilterCondition.IS_EMPTY && condition !== TextFilterCondition.IS_NOT_EMPTY}
				<input type="text" {value} on:change={handleValueChange} />
			{/if}
		</Stack>
		<Stack spacing="sm" align="center">
			<Switch value={isEnabled} on:change={() => handleToggle()} />
			<IconButton iconId="trash" on:click={() => handleDeleteClick()} />
		</Stack>
	</Flex>
</div>

<style>
	.vault-explorer-property-filter input {
		max-width: 100px;
	}

	.vault-explorer-property-filter select {
		max-width: 150px;
	}
</style>
