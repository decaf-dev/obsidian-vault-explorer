<script lang="ts">
	import Stack from "src/svelte/shared/components/stack.svelte";
	import { TFilterGroup } from "src/types";
	import { tick } from "svelte";
	import Flex from "src/svelte/shared/components/flex.svelte";
	import GroupListItem from "./group-list-item.svelte";

	export let groups: TFilterGroup[];
	export let selectedGroup: TFilterGroup | undefined;

	let listContainerRef: HTMLDivElement | null;
	let previousLength = 0;

	// // Reactive statement that runs when `items` changes
	// $: if (groups.length > previousLength) {
	// 	previousLength = groups.length;
	// 	if (listContainerRef) {
	// 		scrollToBottom();
	// 	}
	// }

	// async function scrollToBottom() {
	// 	await tick(); // Wait for the DOM to update
	// 	if (listContainerRef) {
	// 		listContainerRef.scrollTop = listContainerRef.scrollHeight;
	// 	}
	// }
</script>

<div class="vault-explorer-group-list">
	<Stack spacing="sm">
		{#each groups as group (group.id)}
			<GroupListItem
				id={group.id}
				name={group.name}
				isSelected={selectedGroup?.id === group.id}
				on:itemClick
				on:itemDragStart
				on:itemDragOver
				on:itemDrop
			/>
		{/each}
	</Stack>
</div>

<style>
	.vault-explorer-group-list {
		width: calc(100% - 25px);
		overflow-x: auto;
		padding-bottom: 8px;
	}
</style>
