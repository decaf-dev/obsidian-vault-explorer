<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Icon from "./icon.svelte";

	type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

	export let ariaLabel = "";
	export let iconId = "";
	export let disabled = false;
	export let isTabbable = true;
	export let size: IconSize = "md";
	export let noPadding: boolean = false;

	const dispatch = createEventDispatcher();
	let ref: HTMLElement;

	function handleClick(event: Event) {
		dispatch("click", { nativeEvent: event });
	}

	function getClassName(noPadding: boolean) {
		let className = "clickable-icon vault-explorer-icon-button";
		if (noPadding) {
			className += " vault-explorer-icon-button--no-padding";
		}
		return className;
	}

	$: className = getClassName(noPadding);
</script>

<button
	class={className}
	tabindex={isTabbable ? 0 : -1}
	{disabled}
	aria-label={ariaLabel}
	bind:this={ref}
	on:click={handleClick}><Icon {iconId} {size} /></button
>

<style>
	.vault-explorer-icon-button--no-padding {
		padding: 0px 4px;
	}
</style>
