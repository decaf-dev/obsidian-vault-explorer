<script lang="ts">
	import { PropertyFilterGroup } from "src/types";
	import GroupTag from "./group-tag.svelte";
	import Stack from "src/svelte/shared/components/stack.svelte";

	export let groups: PropertyFilterGroup[] = [];
	export let selectedGroupId: string | undefined;
</script>

<div class="vault-explorer-group-tag-list">
	<Stack>
		{#each groups as group, index (group.id)}
			<GroupTag
				id={group.id}
				name={group.name}
				isSelected={selectedGroupId === undefined
					? index === 0
					: group.id === selectedGroupId}
				on:groupClick
			/>
		{/each}
	</Stack>
</div>

<style>
	.vault-explorer-group-tag-list {
		max-width: calc(100% - 50px);
		overflow-x: auto;
	}

	.vault-explorer-group-tag-list::-webkit-scrollbar {
		display: none;
	}
</style>
