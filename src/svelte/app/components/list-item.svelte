<script lang="ts">
	import { MarkdownView } from "obsidian";
	import VaultExplorerPlugin from "src/main";
	import store from "../../shared/services/store";
	import { HOVER_LINK_SOURCE_ID } from "src/constants";
	import Tag from "src/svelte/shared/components/tag.svelte";
	import Wrap from "src/svelte/shared/components/wrap.svelte";

	export let name: string;
	export let path: string;
	export let tags: string[] | null;

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
	<Wrap justify="space-between" spacingX="xl" spacingY="sm">
		<div
			tabindex="0"
			role="link"
			class="vault-explorer-list-item__title"
			on:focus={() => {}}
			on:click={handleTitleClick}
			on:keydown={(e) =>
				(e.key === "Enter" || e.key === " ") && handleTitleClick()}
			on:mouseover={(event) => {
				plugin.app.workspace.trigger("hover-link", {
					event,
					linktext: path,
					source: HOVER_LINK_SOURCE_ID,
					targetEl: event.currentTarget,
					hoverParent: event.currentTarget.parentElement,
				});
			}}
		>
			{name}
		</div>
		{#if tags != null}
			<div class="vault-explorer-list-item__tags">
				{#each tags as tag}
					<Tag name={tag} variant="unstyled" />
				{/each}
			</div>
		{/if}
	</Wrap>
</div>

<style>
	.vault-explorer-list-item {
		padding-bottom: 2px;
		border-bottom: 1px solid var(--background-modifier-border);
		margin-bottom: 10px;
	}

	.vault-explorer-list-item__title:focus-visible {
		box-shadow: 0 0 0 3px var(--background-modifier-border-focus);
	}

	.vault-explorer-list-item__title {
		cursor: pointer;
		color: var(--text-accent);
	}

	.vault-explorer-list-item__tags {
		display: flex;
		flex-wrap: wrap;
		row-gap: 5px;
		column-gap: 5px;
	}
</style>
