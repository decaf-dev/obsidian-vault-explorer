<script lang="ts">
	import { setIcon } from "obsidian";
	import { afterUpdate, onMount } from "svelte";
	import { getSvgData } from "../services/get-svg-data";

	export let ariaLabel = "";
	export let iconId = "";
	export let xs = false;

	let ref: HTMLElement | null = null;

	onMount(() => {
		updateIcon();
	});

	afterUpdate(() => {
		updateIcon();
	});

	function updateIcon() {
		if (!ref) return;
		if (iconId === "ellipsis-vertical") return;
		setIcon(ref, iconId);

		const icon = ref.querySelector("svg");

		if (icon) {
			icon.style.setProperty(
				"width",
				xs ? "var(--icon-xs)" : "var(--icon-m)",
			);
			icon.style.setProperty(
				"height",
				xs ? "var(--icon-xs)" : "var(--icon-m)",
			);
		}
	}

	$: svgData = getSvgData(iconId);

	$: className = `vault-explorer-icon ${xs ? "vault-explorer-icon--xs" : "vault-explorer-icon--md"}`;
</script>

<div class={className} aria-label={ariaLabel} bind:this={ref}>
	{@html svgData}
</div>

<style>
	.vault-explorer-icon {
		cursor: var(--cursor);
		color: var(--icon-color);
		opacity: var(--icon-opacity);
	}

	.vault-explorer-icon--md {
		width: var(--icon-m);
		height: var(--icon-m);
	}

	.vault-explorer-icon--xs {
		width: var(--icon-xs);
		height: var(--icon-xs);
	}
</style>
