<script lang="ts">
	import { MarkdownView } from "obsidian";
	import { onMount } from "svelte";
	import { WordBreak } from "src/types";
	import { HOVER_LINK_SOURCE_ID } from "src/constants";
	import EventManager from "src/event/event-manager";
	import VaultExplorerPlugin from "src/main";
	import store from "src/svelte/shared/services/store";
	import { formatBearTime } from "../services/time-utils";
	import Stack from "src/svelte/shared/components/stack.svelte";
	import Tag from "src/svelte/shared/components/tag.svelte";
	import { removeFrontmatterBlock } from "../services/frontmatter-utils";

	export let name: string;
	export let path: string;
	export let tags: string[] | null;
	export let createdMillis: number;
	export let content: string | null;

	let wordBreak: WordBreak = "normal";

	let plugin: VaultExplorerPlugin;
	store.plugin.subscribe((value) => {
		plugin = value;
		wordBreak = plugin.settings.titleWrapping;
	});

	onMount(() => {
		function handleTitleWrappingSettingChange() {
			wordBreak = plugin.settings.titleWrapping;
		}

		EventManager.getInstance().on(
			"title-wrapping-setting-change",
			handleTitleWrappingSettingChange,
		);
		return () => {
			EventManager.getInstance().off(
				"title-wrapping-setting-change",
				handleTitleWrappingSettingChange,
			);
		};
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

	const creationString = formatBearTime(createdMillis);

	function getDisplayContent(content: string | null) {
		if (content != null) {
			const contentWithoutFrontmatter = removeFrontmatterBlock(content);
			if (contentWithoutFrontmatter.length > 250) {
				return contentWithoutFrontmatter.slice(0, 250) + "...";
			} else {
				return contentWithoutFrontmatter;
			}
		}
		return content;
	}

	$: displayContent = getDisplayContent(content);
</script>

<div class="vault-explorer-feed-card">
	<Stack spacing="sm" direction="column">
		<div
			tabindex="0"
			role="link"
			class="vault-explorer-feed-card__title"
			style={`word-break: ${wordBreak};`}
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
		{#if displayContent != null && displayContent.length > 0}
			<div class="vault-explorer-feed-card__content">
				{displayContent}
			</div>
		{/if}
		{#if tags != null}
			<div class="vault-explorer-feed-card__tags">
				{#each tags as tag}
					<Tag name={tag} variant="unstyled" />
				{/each}
			</div>
		{/if}
		<div class="vault-explorer-feed-card__creation-time">
			{creationString}
		</div>
	</Stack>
</div>

<style>
	.vault-explorer-feed-card {
		padding-bottom: 10px;
		border-bottom: 1px solid var(--background-modifier-border);
		margin-bottom: 10px;
	}

	.vault-explorer-feed-card__title {
		cursor: pointer;
		color: var(--text-accent);
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.vault-explorer-feed-card__tags {
		display: flex;
		flex-wrap: wrap;
		row-gap: 5px;
		column-gap: 5px;
	}

	.vault-explorer-feed-card__title:focus-visible {
		box-shadow: 0 0 0 3px var(--background-modifier-border-focus);
	}

	.vault-explorer-feed-card__content {
		color: var(--text-muted);
	}

	.vault-explorer-feed-card__creation-time {
		color: var(--text-muted);
		font-size: var(--font-smallest);
	}
</style>
