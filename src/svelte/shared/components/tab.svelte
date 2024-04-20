<script lang="ts">
	import { createEventDispatcher, getContext } from "svelte";
	const dispatch = createEventDispatcher();

	let index: number;

	const selectedTab = getContext("selectedTab") as Writable<number>;
	const registerTab = getContext("registerTab") as () => number;

	// We use onMount to ensure the index is set after the component is mounted
	import { onMount } from "svelte";
	import { Writable } from "svelte/store";
	onMount(() => {
		index = registerTab();
	});

	function handleClick(event: Event) {
		selectedTab.set(index);
		dispatch("click", { nativeEvent: event });
	}

	$: isSelected = $selectedTab === index;

	$: className =
		"vault-explorer-tab" +
		(isSelected ? " vault-explorer-tab--active" : "");
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
