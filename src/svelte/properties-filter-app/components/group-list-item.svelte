<script lang="ts">
	export let id: string;
	export let name: string;
	export let isSelected: boolean;

	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();

	function handleClick() {
		dispatch("itemClick", { id });
	}

	function handleDragStart(event: Event) {
		dispatch("itemDragStart", { nativeEvent: event, id });
	}

	function handleDragOver(event: Event) {
		dispatch("itemDragOver", { nativeEvent: event, id });
	}

	function handleDrop(event: Event) {
		dispatch("itemDrop", { nativeEvent: event, id });
	}

	$: className =
		"vault-explorer-group-item" +
		(isSelected ? " vault-explorer-group-item--active" : "");
</script>

<div
	tabindex="0"
	draggable="true"
	role="button"
	class={className}
	on:dragstart={handleDragStart}
	on:dragover={handleDragOver}
	on:drop={handleDrop}
	on:click={handleClick}
	on:keydown={(e) => (e.key === "Enter" || e.key === " ") && handleClick()}
>
	{name}
</div>

<style>
	.vault-explorer-group-item {
		display: flex;
		width: calc(100% - 12px);
		padding: 4px 6px;
	}

	.vault-explorer-group-item:focus-visible {
		box-shadow: inset 0 0 0 3px var(--background-modifier-border-focus);
	}

	.vault-explorer-group-item:hover {
		background-color: var(--background-modifier-hover);
	}

	.vault-explorer-group-item--active {
		background-color: var(--background-modifier-hover);
	}
</style>
