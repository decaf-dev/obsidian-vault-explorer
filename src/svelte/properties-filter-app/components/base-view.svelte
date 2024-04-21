<script lang="ts">
	import Divider from "src/svelte/shared/components/divider.svelte";
	import Flex from "src/svelte/shared/components/flex.svelte";
	import IconButton from "src/svelte/shared/components/icon-button.svelte";
	import Stack from "src/svelte/shared/components/stack.svelte";
	import Switch from "src/svelte/shared/components/switch.svelte";
	import { PropertyFilterGroup } from "src/types";

	export let groups: PropertyFilterGroup[];
	export let selectedGroup: PropertyFilterGroup | undefined;

	import { createEventDispatcher } from "svelte";
	import GroupTagList from "./group-tag-list.svelte";
	const dispatch = createEventDispatcher();

	function handleGroupToggle() {
		dispatch("groupToggle");
	}

	function handleAddGroupClick() {
		dispatch("addGroupClick");
	}

	function handleDeleteGroupClick() {
		dispatch("deleteGroupClick");
	}

	function handleEditClick() {
		dispatch("editClick");
	}
</script>

<div>
	<Stack direction="column" spacing="sm">
		<GroupTagList
			{groups}
			selectedGroupId={selectedGroup?.id}
			on:groupClick
		/>
		<Flex>
			<IconButton
				ariaLabel="Add property filter group"
				iconId="plus"
				on:click={() => handleAddGroupClick()}
			/>
		</Flex>
		<Divider />
	</Stack>
	{#if selectedGroup !== undefined}
		<Stack align="center">
			<IconButton
				ariaLabel="Edit property filter group"
				iconId="pencil"
				on:click={() => handleEditClick()}
			/>
			<IconButton
				ariaLabel="Delete property filter group"
				iconId="trash"
				on:click={() => handleDeleteGroupClick()}
			/>
			<Flex justify="flex-end" width="100%">
				<Switch
					ariaLabel="Toggle property filter group"
					value={selectedGroup.isEnabled}
					on:change={() => handleGroupToggle()}
				/>
			</Flex>
		</Stack>
	{/if}
</div>
