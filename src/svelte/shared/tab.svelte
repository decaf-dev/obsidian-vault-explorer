<script lang="ts">
	export let isSelected: boolean = false;

	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();

	function handleClick(event: Event) {
		dispatch("click", { nativeEvent: event });
	}

	let className = "vault-explorer-tab";
	if (isSelected) {
		className += " vault-explorer-tab--active";
	}
</script>

<button class={className} on:click={handleClick}><slot /></button>

<style>
	.vault-explorer-tab {
		all: unset;
		padding: 4px 6px;
	}

	.vault-explorer-tab--active {
		background-color: var(--background-modifier-hover);
	}

	.vault-explorer-tab:hover {
		background-color: var(--background-modifier-hover);
	}
</style>
