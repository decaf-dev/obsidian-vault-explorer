<script lang="ts">
	import VaultExplorerPlugin from "src/main";
	import store from "../services/store";

	export let name: string;

	let plugin: VaultExplorerPlugin;
	store.plugin.subscribe((p) => {
		plugin = p;
	});

	function handleClick() {
		const searchPlugin = (plugin.app as any).internalPlugins.plugins[
			"global-search"
		];
		if (searchPlugin) {
			searchPlugin.instance.openGlobalSearch(`tag:#${name}`);
		}
	}
</script>

<a
	class="tag vault-explorer-tag"
	href={`#${name}`}
	target="_blank"
	rel="noopener"
	on:click={handleClick}
>
	#{name}
</a>

<style>
	.vault-explorer-tag {
		white-space: nowrap;
	}

	.vault-explorer-tag:focus-visible {
		box-shadow: inset 0 0 0 2px var(--background-modifier-border-focus);
	}
</style>
