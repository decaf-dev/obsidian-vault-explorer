<script lang="ts">
	import { setIcon } from "obsidian";
	import { onMount } from "svelte";

	export let ariaLabel = "";
	export let iconId = "";
	export let xs = false;

	let ref: HTMLElement;

	// Use onMount to ensure the element is available in the DOM
	onMount(() => {
		if (iconId === "ellipsis-vertical") return;
		setIcon(ref, iconId);

		const icon = ref.querySelector("svg");

		if (xs && icon) {
			icon.style.setProperty("width", "var(--icon-xs)");
			icon.style.setProperty("height", "var(--icon-xs)");
		}
	});

	$: className = `vault-explorer-icon ${xs ? "vault-explorer-icon--xs" : ""}`;
</script>

<div class={className} aria-label={ariaLabel} bind:this={ref}></div>

<style>
	.vault-explorer-icon {
		cursor: var(--cursor);
		color: var(--icon-color);
		opacity: var(--icon-opacity);
	}

	.vault-explorer-icon--xs {
		height: var(--icon-xs);
	}
</style>
