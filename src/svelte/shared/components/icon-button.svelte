<script lang="ts">
	import { setIcon } from "obsidian";
	import { createEventDispatcher, onMount } from "svelte";
	import { getSvgData } from "../services/get-svg-data";
	import Stack from "./stack.svelte";

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
		setIcon(ref, iconId);

		if (ref.childNodes.length == 2) {
			const firstElement = ref.firstChild;
			const secondElement = ref.lastChild;
			if (firstElement && secondElement) {
				ref.insertBefore(secondElement, firstElement);

				const svg = ref.querySelector("svg");
				if (svg) {
					svg.style.marginRight = "4px";
				}
			}
		}
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
	on:click={handleClick}>{@html svgData}<slot /></button
>

<style>
	.vault-explorer-icon--no-padding {
		padding: 0;
	}
</style>
