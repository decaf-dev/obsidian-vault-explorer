<script lang="ts">
	import { PropertyFilterGroup } from "src/types";
	import GroupTag from "./group-tag.svelte";
	import Stack from "src/svelte/shared/components/stack.svelte";

	export let groups: PropertyFilterGroup[] = [];
</script>

<div class="vault-explorer-group-tag-list">
	<Stack spacing="sm">
		{#each groups as group (group.id)}
			<GroupTag
				id={group.id}
				name={group.name}
				isSelected={group.isEnabled}
				on:groupClick
			/>
		{/each}
	</Stack>
</div>

<style>
	.vault-explorer-group-tag-list {
		max-width: 390px;
		overflow-x: auto;
	}

	.vault-explorer-group-tag-list::-webkit-scrollbar {
		display: none;
	}
</style>