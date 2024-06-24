<script lang="ts">
	import VaultExplorerPlugin from "src/main";
	import PropertiesFilterModal from "src/obsidian/properties-filter-modal";
	import IconButton from "src/svelte/shared/components/icon-button.svelte";
	import Stack from "src/svelte/shared/components/stack.svelte";
	import store from "src/svelte/shared/services/store";
	import { FilterGroup } from "src/types";
	import GroupTagList from "./group-tag-list.svelte";

	export let groups: FilterGroup[] = [];

	let plugin: VaultExplorerPlugin;

	store.plugin.subscribe((value) => {
		plugin = value;
	});

	function handleButtonClick() {
		new PropertiesFilterModal(plugin).open();
	}
</script>

<div class="vault-explorer-custom-filter">
	<Stack align="center" spacing="sm">
		{#if groups.length > 0}
			<GroupTagList
				{groups}
				on:groupClick
				on:groupDrop
				on:groupDragOver
				on:groupDragStart
			/>
		{/if}
		{#if groups.length === 0}
			<span class="vault-explorer-empty-label">No groups</span>
		{/if}
		<IconButton
			ariaLabel="Change custom filter"
			iconId="ellipsis-vertical"
			on:click={handleButtonClick}
		/>
	</Stack>
</div>

<style>
	.vault-explorer-custom-filter {
		margin-left: -4px;
	}

	.vault-explorer-empty-label {
		color: var(--text-faint);
		font-size: var(--font-smaller);
	}
</style>
