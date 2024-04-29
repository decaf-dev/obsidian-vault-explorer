<script lang="ts">
	import { createEventDispatcher, getContext } from "svelte";
	const dispatch = createEventDispatcher();

	const id = generateUUID();
	const selectedTab = getContext("selectedTab") as Writable<string>;
	const registerTab = getContext("registerTab") as (id: string) => void;
	const unregisterTab = getContext("unregisterTab") as (id: string) => void;
	// const registeredTabs = getContext("registeredTabs") as string[];
	const variant = getContext("variant") as string;

	// We use onMount to ensure the index is set after the component is mounted
	import { onMount } from "svelte";
	import { Writable } from "svelte/store";
	import { generateUUID } from "../services/uuid";

	onMount(() => {
		registerTab(id);

		return () => {
			unregisterTab(id);
		};
	});

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

<button class={className} on:click={handleClick}><slot /></button>

<style>
	.vault-explorer-tab {
		all: unset;
		padding: 4px 6px;
		white-space: nowrap;
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
