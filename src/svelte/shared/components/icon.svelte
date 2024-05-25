<script lang="ts">
	import { setIcon } from "obsidian";
	import { onMount } from "svelte";

	export let ariaLabel = "";
	export let iconId = "";

	let ref: HTMLElement;

	// Use onMount to ensure the element is available in the DOM
	onMount(() => {
		if (iconId === "ellipsis-vertical") return;
		setIcon(ref, iconId);
	});
</script>

<div class="vault-explorer-icon" aria-label={ariaLabel} bind:this={ref}></div>

<style>
	.vault-explorer-icon {
		cursor: var(--cursor);
		color: var(--icon-color);
		opacity: var(--icon-opacity);
	}
</style>
