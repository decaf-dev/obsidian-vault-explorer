<script lang="ts">
	import { TFilterGroup } from "src/types";
	import _ from "lodash";
	import VaultExplorerPlugin from "src/main";
	import store from "src/svelte/shared/services/store";
	import FilterGroup from "./filter-group.svelte";
	import Stack from "src/svelte/shared/components/stack.svelte";

	export let groups: TFilterGroup[] = [];

	let plugin: VaultExplorerPlugin;

	store.plugin.subscribe((p) => {
		plugin = p;
	});
</script>

<div class="vault-explorer-filter-group-list">
	<Stack spacing="md" width="fit-content">
		{#if groups.length > 0}
			{#each groups as group (group.id)}
				<FilterGroup
					id={group.id}
					name={group.name}
					isSelected={group.isEnabled}
					isSticky={group.isSticky}
					on:groupClick
					on:groupDrop
					on:groupDragOver
					on:groupDragStart
					on:groupContextMenu
				/>
			{/each}
		{/if}
		{#if groups.length === 0}
			<span class="vault-explorer-empty-label">No groups</span>
		{/if}
	</Stack>
</div>

<style>
	.vault-explorer-filter-group-list {
		width: min(100%, 700px);
		overflow-x: auto;
		padding-bottom: 8px;
	}

	.vault-explorer-empty-label {
		color: var(--text-faint);
		font-size: var(--font-smaller);
	}
</style>
