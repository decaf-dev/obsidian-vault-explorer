<script lang="ts">
	import { createEventDispatcher, getContext } from "svelte";
	import { onMount } from "svelte";
	import { Writable } from "svelte/store";
	import { generateRandomId } from "../services/random";

	const dispatch = createEventDispatcher();

	export let draggable = false;

	const id = generateRandomId();
	const selectedTab = getContext("selectedTab") as Writable<string>;
	const registerTab = getContext("registerTab") as (id: string) => void;
	const unregisterTab = getContext("unregisterTab") as (id: string) => void;
	const variant = getContext("variant") as string;

	onMount(() => {
		registerTab(id);

		return () => {
			unregisterTab(id);
		};
	});

	function handleDragStart(event: Event) {
		dispatch("dragstart", { nativeEvent: event });
	}

	function handleDragOver(event: Event) {
		dispatch("dragover", { nativeEvent: event });
	}

	function handleDrop(event: Event) {
		dispatch("drop", { nativeEvent: event });
	}

	function handleClick(event: Event) {
		selectedTab.set(id);
		dispatch("click", { nativeEvent: event });
	}

	$: isSelected = $selectedTab === id;
	$: className = findClassName(variant, isSelected);

	function findClassName(variant: string, isSelected: boolean) {
		let className = "vault-explorer-tab";
		if (variant === "line") {
			className += " vault-explorer-tab__line";
			if (isSelected) {
				className += "--active";
			}
		} else if (variant === "rounded") {
			className += " vault-explorer-tab__rounded";
			if (isSelected) {
				className += "--active";
			}
		}
		return className;
	}
</script>

<div
	tabindex="0"
	role="button"
	class={className}
	{draggable}
	on:click={handleClick}
	on:dragstart={handleDragStart}
	on:dragover={handleDragOver}
	on:drop={handleDrop}
	on:keydown={(e) => (e.key === "Enter" || e.key === " ") && handleClick(e)}
>
	<slot />
</div>

<style>
	.vault-explorer-tab {
		padding: 4px 6px;
		white-space: nowrap;
		border-radius: var(--radius-s);
	}

	.vault-explorer-tab:focus-visible {
		box-shadow: inset 0 0 0 2px var(--background-modifier-border-focus);
	}

	.vault-explorer-tab__line {
		color: var(--text-faint);
	}

	.vault-explorer-tab__line--active {
		border-bottom: 1px solid var(--color-accent);
		color: var(--text-normal);
	}

	.vault-explorer-tab--rounded {
		border-radius: 4px;
	}

	.vault-explorer-tab__rounded--active {
		background-color: var(--background-modifier-hover);
	}

	.vault-explorer-tab__rounded:hover {
		background-color: var(--background-modifier-hover);
	}
</style>
