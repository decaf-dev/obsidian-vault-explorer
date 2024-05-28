<script lang="ts">
	import IconButton from "src/svelte/shared/components/icon-button.svelte";
	import Stack from "src/svelte/shared/components/stack.svelte";
	import { PropertyFilterGroup } from "src/types";

	export let groups: PropertyFilterGroup[];
	export let selectedGroup: PropertyFilterGroup | undefined;

	let listContainerRef: HTMLDivElement | null;
	let previousLength = 0;

	// Reactive statement that runs when `items` changes
	$: if (groups.length > previousLength) {
		previousLength = groups.length;
		if (listContainerRef) {
			scrollToBottom();
		}
	}

	async function scrollToBottom() {
		await tick(); // Wait for the DOM to update
		if (listContainerRef) {
			listContainerRef.scrollTop = listContainerRef.scrollHeight;
		}
	}

	import { createEventDispatcher, tick } from "svelte";
	import Flex from "src/svelte/shared/components/flex.svelte";
	import GroupListItem from "./group-list-item.svelte";

	const dispatch = createEventDispatcher();

	function handleAddGroupClick() {
		dispatch("addGroupClick");
	}

	function handleDeleteGroupClick() {
		dispatch("deleteGroupClick");
	}
</script>

<div class="vault-explorer-group-list-container">
	<Stack direction="column" spacing="sm">
		<Stack spacing="sm">
			<IconButton
				ariaLabel="Add property filter group"
				iconId="plus"
				on:click={() => handleAddGroupClick()}
			/>
			<IconButton
				ariaLabel="Delete property filter group"
				iconId="trash"
				on:click={() => handleDeleteGroupClick()}
			/>
		</Stack>
		<div class="vault-explorer-group-list" bind:this={listContainerRef}>
			<Flex direction="column" width="100px">
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
			</Flex>
		</div>
	</Stack>
</div>

<style>
	.vault-explorer-group-list-container {
		margin-right: 5px;
	}

	.vault-explorer-group-list {
		max-height: 220px;
		height: 100%;
		overflow-y: auto;
	}
</style>
