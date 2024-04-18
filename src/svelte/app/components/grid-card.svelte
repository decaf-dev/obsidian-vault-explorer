<script lang="ts">
	import { MarkdownView } from "obsidian";
	import IconButton from "../../shared/icon-button.svelte";
	import Tag from "../../shared/tag.svelte";
	import Spacer from "../../shared/spacer.svelte";
	import Property from "src/svelte/shared/property.svelte";
	import VaultExplorerPlugin from "src/main";
	import store from "../store";

	export let name: string;
	export let path: string;
	export let url: string | null;
	export let tags: string[] | null;
	export let source: string | null;
	export let status: string | null;

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

	function handleUrlClick() {
		if (url != null) {
			window.open(url, "_blank");
		}
	}
</script>

<div class="vault-explorer-grid-card">
	<div class="vault-explorer-grid-card__header">
		<a
			href="empty"
			class="vault-explorer-grid-card__title"
			on:click={handleTitleClick}
		>
			{name}
		</a>
		{#if url !== null}
			<IconButton iconId="external-link" on:click={handleUrlClick} />
		{/if}
	</div>
	<Spacer size="md" />
	<div class="vault-explorer-grid-card__content">
		{#if tags !== null}
			<div class="vault-explorer-grid-card__tags">
				{#each tags as tag}
					<Tag name={tag} />
				{/each}
			</div>
		{/if}
		{#if source !== null}<Property name="source" value={source} />{/if}
		<div class="vault-explorer-grid-card__labels">
			{#if status !== null}
				<div>
					<Property name="status" value={status} />
					<Spacer size="xs" />
					<div class="vault-explorer-property-label">Status</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.vault-explorer-grid-card {
		padding: 20px;
		box-shadow: var(--shadow-s);
		border: 1px solid var(--background-modifier-border);
	}

	.vault-explorer-grid-card__header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		column-gap: 0.5rem;
	}

	.vault-explorer-grid-card__content {
		display: flex;
		flex-direction: column;
		row-gap: 0.5rem;
	}

	.vault-explorer-grid-card__title {
		all: unset;
		cursor: pointer;
		color: var(--text-accent);
	}

	.vault-explorer-grid-card__tags {
		display: flex;
		column-gap: 0.25rem;
		height: min-content;
		overflow-x: auto;
	}

	.vault-explorer-grid-card__tags::-webkit-scrollbar {
		display: none;
	}

	.vault-explorer-grid-card__labels {
		display: flex;
	}

	.vault-explorer-property-label {
		margin-left: 8px;
		font-size: var(--font-smallest);
		color: var(--text-muted);
	}
</style>
