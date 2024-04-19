<script lang="ts">
	import VaultExplorerPlugin from "src/main";
	import store from "../app/store";

	export let name: string;
	export let value: string;

	let plugin: VaultExplorerPlugin;
	store.plugin.subscribe((p) => {
		plugin = p;
	});

	function handleClick() {
		const searchPlugin = (plugin.app as any).internalPlugins.plugins[
			"global-search"
		];
		if (searchPlugin) {
			searchPlugin.instance.openGlobalSearch(`["${name}":${value}`);
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
	{value}
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
</style>
