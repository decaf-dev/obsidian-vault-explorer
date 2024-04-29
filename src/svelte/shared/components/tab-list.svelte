<script lang="ts">
	import { setContext } from "svelte";
	import { writable } from "svelte/store";
	import Stack from "./stack.svelte";

	export let initialSelectedIndex: number = 0;
	export let variant: "rounded" | "line" = "rounded";

	let registeredTabs: string[] = [];

	const selectedTab = writable<string>(); // A store to keep track of the selected tab

	$: initialSelectedIndex,
		registeredTabs.length,
		selectedTab.set(registeredTabs[initialSelectedIndex]);

	function registerTab(id: string) {
		registeredTabs = [...registeredTabs, id];
	}

	function unregisterTab(id: string) {
		registeredTabs = registeredTabs.filter((tabId) => tabId !== id);
	}

	setContext("selectedTab", selectedTab);
	setContext("registerTab", registerTab);
	setContext("unregisterTab", unregisterTab);
	setContext("variant", variant);

	$: className =
		"vault-explorer-tab-list" +
		(variant === "line" ? " vault-explorer-tab-list--line" : "");
</script>

<div class={className}>
	<Stack spacing="sm">
		<slot />
	</Stack>
</div>

<style>
	.vault-explorer-tab-list {
		width: 100%;
		overflow-x: auto;
	}

	.vault-explorer-tab-list--line {
		border-bottom: 1px solid var(--background-modifier-border);
	}

	.vault-explorer-tab-list::-webkit-scrollbar {
		display: none;
	}
</style>
