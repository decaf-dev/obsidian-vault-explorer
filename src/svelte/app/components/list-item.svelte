<script lang="ts">
	import { MarkdownView } from "obsidian";
	import VaultExplorerPlugin from "src/main";
	import store from "../../shared/services/store";

	export let name: string;
	export let path: string;

	let plugin: VaultExplorerPlugin;
	store.plugin.subscribe((p) => {
		plugin = p;
	});

	function handleTitleClick() {
		const leaves = plugin.app.workspace.getLeavesOfType("markdown");
		const leaf = leaves.find((leaf) => {
			return ((leaf.view as MarkdownView).file?.path ?? "") === path;
		});

		if (leaf) {
			plugin.app.workspace.setActiveLeaf(leaf);
		} else {
			plugin.app.workspace.openLinkText(path, "vault-explorer");
		}
	}
</script>

<div class="vault-explorer-list-item">
	<div
		tabindex="0"
		role="link"
		class="vault-explorer-list-item__title"
		on:click={handleTitleClick}
		on:keydown={(e) =>
			(e.key === "Enter" || e.key === " ") && handleTitleClick()}
	>
		{name}
	</div>
</div>

<style>
	.vault-explorer-list-item {
		max-width: 800px;
		padding-bottom: 2px;
		border-bottom: 1px solid var(--background-modifier-border);
		margin-bottom: 10px;
	}

	.vault-explorer-list-item__title {
		cursor: pointer;
		color: var(--text-accent);
	}
</style>
