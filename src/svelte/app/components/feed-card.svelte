<script lang="ts">
	import { MarkdownView } from "obsidian";
	import { onMount } from "svelte";
	import { WordBreak } from "src/types";
	import { HOVER_LINK_SOURCE_ID } from "src/constants";
	import EventManager from "src/event/event-manager";
	import VaultExplorerPlugin from "src/main";
	import store from "src/svelte/shared/services/store";
	import { formatAsBearTimeString } from "../services/time-string";
	import Stack from "src/svelte/shared/components/stack.svelte";
	import Tag from "src/svelte/shared/components/tag.svelte";
	import { removeFrontmatterBlock } from "../services/utils/frontmatter-utils";
	import Icon from "src/svelte/shared/components/icon.svelte";
	import { getIconIdForFile } from "../services/file-icon";
	import { PluginEvent } from "src/event/types";
	import Wrap from "src/svelte/shared/components/wrap.svelte";

	export let displayName: string;
	export let baseName: string;
	export let extension: string;
	export let path: string;
	export let tags: string[] | null;
	export let createdMillis: number;
	export let content: string | null;

	let ref: HTMLElement | null = null;
	let wordBreak: WordBreak = "normal";
	let enableFileIcons = false;
	let collapseContent = false;
	let contentModifierClassName = "";

	let plugin: VaultExplorerPlugin;
	store.plugin.subscribe((value) => {
		plugin = value;
		wordBreak = plugin.settings.titleWrapping;
		enableFileIcons = plugin.settings.enableFileIcons;
		collapseContent = plugin.settings.views.feed.collapseContent;
	});

	onMount(() => {
		function handleFileIconsChange() {
			enableFileIcons = plugin.settings.enableFileIcons;
		}

		EventManager.getInstance().on(
			PluginEvent.FILE_ICONS_SETTING_CHANGE,
			handleFileIconsChange,
		);
		return () => {
			EventManager.getInstance().off(
				PluginEvent.FILE_ICONS_SETTING_CHANGE,
				handleFileIconsChange,
			);
		};
	});

	onMount(() => {
		function handleTitleWrappingSettingChange() {
			wordBreak = plugin.settings.titleWrapping;
		}

		EventManager.getInstance().on(
			PluginEvent.TITLE_WRAPPING_SETTING_CHANGE,
			handleTitleWrappingSettingChange,
		);
		return () => {
			EventManager.getInstance().off(
				PluginEvent.TITLE_WRAPPING_SETTING_CHANGE,
				handleTitleWrappingSettingChange,
			);
		};
	});

	onMount(() => {
		function handleCollapseFeedContentChange() {
			collapseContent = plugin.settings.views.feed.collapseContent;
		}

		EventManager.getInstance().on(
			PluginEvent.COLLAPSE_FEED_CONTENT_CHANGE,
			handleCollapseFeedContentChange,
		);
		return () => {
			EventManager.getInstance().off(
				PluginEvent.COLLAPSE_FEED_CONTENT_CHANGE,
				handleCollapseFeedContentChange,
			);
		};
	});

	function checkLeafWidth(leafEl: HTMLElement) {
		const SCREEN_SIZE_MD = 600;
		const SCREEN_SIZE_LG = 1024;

		const { clientWidth } = leafEl;
		if (clientWidth < SCREEN_SIZE_MD) {
			contentModifierClassName = "vault-explorer-feed-card__content--sm";
		} else if (
			clientWidth >= SCREEN_SIZE_MD &&
			clientWidth < SCREEN_SIZE_LG
		) {
			contentModifierClassName = "vault-explorer-feed-card__content--md";
		} else {
			contentModifierClassName = "vault-explorer-feed-card__content--lg";
		}
	}
	onMount(() => {
		let resizeObserver: ResizeObserver;

		const leafEl = ref?.closest(
			".workspace-leaf-content",
		) as HTMLElement | null;
		if (leafEl) {
			checkLeafWidth(leafEl);

			resizeObserver = new ResizeObserver(() => {
				checkLeafWidth(leafEl);
			});
			resizeObserver.observe(leafEl);
		}

		return () => {
			resizeObserver?.disconnect();
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

	const creationString = formatAsBearTimeString(createdMillis);

	function getDisplayContent(
		content: string | null,
		collapseContent: boolean,
	) {
		if (content != null) {
			let modifiedContent = removeFrontmatterBlock(content);
			if (collapseContent) {
				modifiedContent = modifiedContent
					.split("\n")
					.map((line) => line.trim())
					.filter((line) => line.length > 0)
					.join("<br/>");
			}
			return modifiedContent;
		}
		return content;
	}

	$: displayContent = getDisplayContent(content, collapseContent);

	$: contentClassName = `vault-explorer-feed-card__content ${contentModifierClassName}`;
</script>

<div class="vault-explorer-feed-card" bind:this={ref}>
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
			<Stack spacing="xs">
				{#if enableFileIcons}
					<Icon iconId={getIconIdForFile(baseName, extension)} />
				{/if}
				<span>{displayName}</span>
			</Stack>
		</div>
		{#if displayContent != null && displayContent.length > 0}
			<div class={contentClassName}>
				{@html displayContent}
			</div>
		{/if}
		{#if tags != null}
			<div class="vault-explorer-feed-card__tags">
				<Wrap spacingX="sm" spacingY="sm">
					{#each tags as tag}
						<Tag name={tag} variant="unstyled" />
					{/each}
				</Wrap>
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

	.vault-explorer-feed-card__title:focus-visible {
		box-shadow: 0 0 0 3px var(--background-modifier-border-focus);
	}

	.vault-explorer-feed-card__content {
		/* these settings support unicode characters as well */
		display: -webkit-box;
		-webkit-box-orient: vertical;
		overflow: hidden;
		word-break: normal;
		color: var(--text-muted);
		white-space: pre-wrap;
		text-overflow: ellipsis;
		-webkit-line-clamp: unset;
	}

	.vault-explorer-feed-card__content--lg {
		-webkit-line-clamp: 5;
	}

	.vault-explorer-feed-card__content--md {
		-webkit-line-clamp: 3;
	}

	.vault-explorer-feed-card__content--sm {
		-webkit-line-clamp: 2;
	}

	.vault-explorer-feed-card__creation-time {
		color: var(--text-muted);
		font-size: var(--font-smallest);
	}
</style>
