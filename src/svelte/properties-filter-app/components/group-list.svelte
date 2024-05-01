<script lang="ts">
	import IconButton from "src/svelte/shared/components/icon-button.svelte";
	import Stack from "src/svelte/shared/components/stack.svelte";
	import { PropertyFilterGroup } from "src/types";

	export let groups: PropertyFilterGroup[];
	export let selectedGroup: PropertyFilterGroup | undefined;

	import { createEventDispatcher } from "svelte";
	import GroupButton from "./group-button.svelte";
	import Flex from "src/svelte/shared/components/flex.svelte";
	const dispatch = createEventDispatcher();

	function handleAddGroupClick() {
		dispatch("addGroupClick");
	}

	function handleDeleteGroupClick() {
		dispatch("deleteGroupClick");
	}

	function handleGroupClick(id: string) {
		dispatch("groupClick", { id });
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
		<div class="vault-explorer-group-list">
			<Flex direction="column" width="100px">
				{#each groups as group (group.id)}
					<GroupButton
						name={group.name}
						isSelected={selectedGroup?.id === group.id}
						on:click={() => handleGroupClick(group.id)}
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
