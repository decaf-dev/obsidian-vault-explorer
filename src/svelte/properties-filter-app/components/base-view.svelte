<script lang="ts">
	import IconButton from "src/svelte/shared/components/icon-button.svelte";
	import Stack from "src/svelte/shared/components/stack.svelte";
	import Switch from "src/svelte/shared/components/switch.svelte";
	import { PropertyFilterGroup } from "src/types";

	export let groups: PropertyFilterGroup[];
	export let selectedGroup: PropertyFilterGroup | undefined;

	import { createEventDispatcher } from "svelte";
	import Spacer from "src/svelte/shared/components/spacer.svelte";
	import TabList from "src/svelte/shared/components/tab-list.svelte";
	import Tab from "src/svelte/shared/components/tab.svelte";
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

	function handleGroupClick(id: string) {
		dispatch("groupClick", { id });
	}

	$: selectedIndex =
		groups.findIndex((group) => group.id === selectedGroup?.id) ?? 0;
</script>

<div>
	<Stack direction="column" spacing="sm">
		<Stack spacing="sm" align="center">
			{#if groups.length > 0}
				<TabList variant="line" initialSelectedIndex={selectedIndex}>
					{#each groups as group (group.id)}
						<Tab on:click={() => handleGroupClick(group.id)}
							>{group.name}</Tab
						>
					{/each}
				</TabList>
			{/if}
			<IconButton
				ariaLabel="Add property filter group"
				iconId="plus"
				on:click={() => handleAddGroupClick()}
			/>
			<Spacer size="md" />
		</Stack>
	</Stack>
	{#if selectedGroup !== undefined}
		<Spacer size="sm" direction="vertical" />
		<Stack align="center">
			<IconButton
				ariaLabel="Edit property filter group"
				iconId="pencil"
				on:click={() => handleEditClick()}
			/>
			<Stack justify="flex-end" width="100%" align="center" spacing="sm">
				<Switch
					ariaLabel="Toggle property filter group"
					value={selectedGroup.isEnabled}
					on:change={() => handleGroupToggle()}
				/>
				<IconButton
					ariaLabel="Delete property filter group"
					iconId="trash"
					on:click={() => handleDeleteGroupClick()}
				/>
				<Spacer size="2xl" />
			</Stack>
		</Stack>
	{/if}
</div>
