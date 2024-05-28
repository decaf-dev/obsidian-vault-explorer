<script lang="ts">
	import { setIcon } from "obsidian";
	import { createEventDispatcher, onMount } from "svelte";

	export let ariaLabel = "";
	export let iconId = "";
	export let disabled = false;
	export let noPadding = false;
	export let isTabbable = true;

	$: svgData = getSvgData(iconId);

	function getSvgData(id: string) {
		if (id === "ellipsis-vertical") {
			return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-ellipsis-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>`;
		}
		return "";
	}

	const dispatch = createEventDispatcher();
	let ref: HTMLElement;

	// Use onMount to ensure the element is available in the DOM
	onMount(() => {
		if (iconId === "ellipsis-vertical") return;
		setIcon(ref, iconId);
	});

	function handleClick(event: Event) {
		dispatch("click", { nativeEvent: event });
	}

	$: className =
		"clickable-icon" +
		(noPadding == true ? " vault-explorer-icon--no-padding" : "");
</script>

<button
	class={className}
	tabindex={isTabbable ? 0 : -1}
	{disabled}
	aria-label={ariaLabel}
	bind:this={ref}
	on:click={handleClick}>{@html svgData}</button
>

<style>
	.vault-explorer-icon--no-padding {
		padding: 0;
	}
</style>
