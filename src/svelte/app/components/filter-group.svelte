<script lang="ts">
	import Icon from "src/svelte/shared/components/icon.svelte";
	import Stack from "src/svelte/shared/components/stack.svelte";
	import { createEventDispatcher } from "svelte";

	export let id: string;
	export let name: string;
	export let isSelected: boolean;
	export let isSticky: boolean;

	const dispatch = createEventDispatcher();

	function handleClick(event: Event) {
		dispatch("groupClick", { id, nativeEvent: event });
	}

	function handleContextMenu() {
		dispatch("groupContextMenu", { id });
	}

	function handleDragStart(event: Event) {
		dispatch("groupDragStart", { nativeEvent: event, id });
	}

	function handleDragOver(event: Event) {
		dispatch("groupDragOver", { nativeEvent: event, id });
	}

	function handleDrop(event: Event) {
		dispatch("groupDrop", { nativeEvent: event, id });
	}

	function getClassName(isSelected: boolean) {
		let className = "vault-explorer-filter-group";
		if (isSelected) {
			className += " vault-explorer-filter-group--active";
		}
		return className;
	}

	$: className = getClassName(isSelected);
</script>

<div
	tabindex="0"
	role="button"
	draggable="true"
	class={className}
	on:dragstart={handleDragStart}
	on:dragover={handleDragOver}
	on:drop={handleDrop}
	on:click={handleClick}
	on:contextmenu={handleContextMenu}
	on:keydown={(e) => (e.key === "Enter" || e.key === " ") && handleClick(e)}
>
	{#if isSticky}
		<Stack spacing="xs" align="center">
			<Icon iconId="pin" size="xs" />
			<div>{name}</div>
		</Stack>
	{/if}
	{#if !isSticky}
		{name}
	{/if}
</div>

<style>
	.vault-explorer-filter-group {
		display: flex;
		align-items: center;
		width: 150px;
		height: 75px;
		white-space: nowrap;
		padding: 4px 8px;
		border-radius: var(--radius-m);
		color: var(--text-faint);
		border: 1px solid var(--background-modifier-border);
		background-color: var(--background-primary);
	}

	.vault-explorer-filter-group:focus-visible {
		box-shadow: inset 0 0 0 2px var(--background-modifier-border-focus);
	}

	.vault-explorer-filter-group--active {
		background-color: var(--tag-background);
		border: 1px solid var(--tag-border-color);
		color: var(--tag-color);
	}
</style>
