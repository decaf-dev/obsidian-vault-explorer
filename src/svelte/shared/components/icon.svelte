<script lang="ts">
	import { setIcon } from "obsidian";
	import { afterUpdate, onMount } from "svelte";
	import { getSvgData } from "../services/get-svg-data";

	type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

	export let ariaLabel: string = "";
	export let iconId: string;
	export let size: IconSize = "md";
	export let color: string = "";
	export let fill: string = "";

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
			icon.style.setProperty("fill", fill);

			const sizeVariable = getSizeVariable();
			icon.style.setProperty("width", sizeVariable);
			icon.style.setProperty("height", sizeVariable);
		}
	}

	function getSizeVariable() {
		if (size === "xs") return `var(--icon-xs)`;
		if (size === "sm") return `var(--icon-sm)`;
		if (size === "md") return `var(--icon-m)`;
		if (size === "lg") return `24px`;
		if (size === "xl") return `var(--icon-xl)`;
		return "";
	}

	function getClassName(size: IconSize) {
		let className = "vault-explorer-icon";

		if (size === "xs") {
			className += " vault-explorer-icon--xs";
		} else if (size === "sm") {
			className += " vault-explorer-icon--sm";
		} else if (size === "md") {
			className += " vault-explorer-icon--md";
		} else if (size === "lg") {
			className += " vault-explorer-icon--lg";
		} else if (size === "xl") {
			className += " vault-explorer-icon--xl";
		}
		return className;
	}

	$: className = getClassName(size);
	$: svgData = getSvgData(iconId, className);
</script>

<div
	class={className}
	style="color: {color};"
	aria-label={ariaLabel}
	bind:this={ref}
>
	{@html svgData}
</div>

<style>
	.vault-explorer-icon {
		cursor: var(--cursor);
		color: var(--icon-color);
		opacity: var(--icon-opacity);
	}

	.vault-explorer-icon--xs {
		width: var(--icon-xs);
		height: var(--icon-xs);
	}

	.vault-explorer-icon--sm {
		width: var(--icon-s);
		height: var(--icon-s);
	}

	.vault-explorer-icon--md {
		width: var(--icon-m);
		height: var(--icon-m);
	}

	/* Obsidian has 18px instead of 24px. I think this a bug */
	.vault-explorer-icon--lg {
		width: 24px;
		height: 24px;
	}

	.vault-explorer-icon--xl {
		width: var(--icon-xl);
		height: var(--icon-xl);
	}
</style>
