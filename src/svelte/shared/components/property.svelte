<script lang="ts">
	import VaultExplorerPlugin from "src/main";
	import store from "../services/store";

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

<a
	href="none"
	class="tag vault-explorer-property"
	target="_blank"
	rel="noopener"
	on:click={handleClick}
>
	{formattedValue}
</a>

<style>
	.vault-explorer-property {
		background-color: var(--color-base-20) !important;
		color: var(--text-normal) !important;
		width: max-content;
		text-wrap: nowrap;
	}

	.vault-explorer-property:hover {
		background-color: var(--color-base-30) !important;
	}

	.vault-explorer-property:focus-visible {
		box-shadow: inset 0 0 0 2px var(--background-modifier-border-focus);
	}
</style>
