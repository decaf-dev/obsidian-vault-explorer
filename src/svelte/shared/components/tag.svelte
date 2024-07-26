<script lang="ts">
	import VaultExplorerPlugin from "src/main";
	import store from "../services/store";

	export let name: string;
	export let variant: "unstyled" | "default" = "default";

	let plugin: VaultExplorerPlugin;
	store.plugin.subscribe((p) => {
		plugin = p;
	});

	function handleClick(e: MouseEvent) {
		e.stopPropagation();

		const searchPlugin = (plugin.app as any).internalPlugins.plugins[
			"global-search"
		];
		if (searchPlugin) {
			searchPlugin.instance.openGlobalSearch(`tag:#${name}`);
		}
	}

	$: className = `vault-explorer-tag vault-explorer-tag--${variant}`;
</script>

<a
	class={className}
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

	.vault-explorer-tag--unstyled {
		color: var(--text-muted);
		text-decoration: none;
		font-size: var(--font-smallest);
	}

	.vault-explorer-tag--default {
		background-color: var(--tag-background);
		border: var(--tag-border-width) solid var(--tag-border-color);
		border-radius: var(--tag-radius);
		color: var(--tag-color);
		font-size: var(--tag-size);
		font-weight: var(--tag-weight);
		text-decoration: var(--tag-decoration);
		padding: var(--tag-padding-y) var(--tag-padding-x);
		line-height: 1;
	}

	.vault-explorer-tag--default:hover {
		background-color: var(--tag-background-hover);
		border: var(--tag-border-width) solid var(--tag-border-color-hover);
		color: var(--tag-color-hover);
	}

	.vault-explorer-tag:focus-visible {
		box-shadow: inset 0 0 0 2px var(--background-modifier-border-focus);
	}
</style>
