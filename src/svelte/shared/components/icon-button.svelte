<script lang="ts">
	import { setIcon } from "obsidian";
	import { createEventDispatcher, onMount } from "svelte";
	import { getSvgData } from "../services/get-svg-data";

	export let ariaLabel = "";
	export let iconId = "";
	export let disabled = false;
	export let noPadding = false;
	export let isTabbable = true;

	const dispatch = createEventDispatcher();
	let ref: HTMLElement;

	// Use onMount to ensure the element is available in the DOM
	onMount(() => {
		if (iconId === "ellipsis-vertical") return;
		if (iconId === "file-pdf") return;
		setIcon(ref, iconId);
	});

	function handleClick(event: Event) {
		dispatch("click", { nativeEvent: event });
	}

	$: className =
		"clickable-icon" +
		(noPadding == true ? " vault-explorer-icon--no-padding" : "");

	$: svgData = getSvgData(iconId);
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
