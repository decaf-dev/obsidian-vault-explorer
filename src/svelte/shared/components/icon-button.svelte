<script lang="ts">
	import { onMount, createEventDispatcher } from "svelte";
	import { setIcon } from "obsidian";

	export let ariaLabel = "";
	export let iconId = "";
	export let disabled = false;

	const dispatch = createEventDispatcher();
	let ref: HTMLElement;

	// Use onMount to ensure the element is available in the DOM
	onMount(() => {
		setIcon(ref, iconId);
	});

	function handleClick(event: Event) {
		dispatch("click", { nativeEvent: event });
	}
</script>

<button
	class="clickable-icon"
	{disabled}
	aria-label={ariaLabel}
	bind:this={ref}
	on:click={handleClick}
></button>
