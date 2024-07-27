<script lang="ts">
	import VaultExplorerPlugin from "src/main";
	import store from "../services/store";
	import Icon from "./icon.svelte";
	import Stack from "./stack.svelte";

	export let name: string;
	export let value: string;

	let formattedValue: string;

	$: {
		if (typeof value === "string") {
			formattedValue = value;
			formattedValue = formattedValue.replace(/\[/g, "");
			formattedValue = formattedValue.replace(/\]/g, "");
		}
	}

	let plugin: VaultExplorerPlugin;
	store.plugin.subscribe((p) => {
		plugin = p;
	});

	function handleClick(e: Event) {
		//Don't click the card
		e.stopPropagation();

		const searchPlugin = (plugin.app as any).internalPlugins.plugins[
			"global-search"
		];
		if (searchPlugin) {
			searchPlugin.instance.openGlobalSearch(
				`["${name}":${formattedValue}]`,
			);
		}
	}
</script>

<div class="vault-explorer-property">
	<Stack spacing="xs">
		<Icon iconId="text" size="xs" />
		<a href="none" target="_blank" rel="noopener" on:click={handleClick}>
			{formattedValue}
		</a>
	</Stack>
</div>

<style>
	.vault-explorer-property a {
		width: max-content;
		color: var(--text-muted);
		text-decoration: none;
		font-size: var(--font-smallest);
	}

	.vault-explorer-property a:hover {
		color: var(--text-faint);
	}

	.vault-explorer-property a:focus-visible {
		box-shadow: inset 0 0 0 2px var(--background-modifier-border-focus);
	}
</style>
