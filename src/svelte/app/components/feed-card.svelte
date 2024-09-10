<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";
	import { CollapseStyle } from "src/types";
	import EventManager from "src/event/event-manager";
	import VaultExplorerPlugin from "src/main";
	import store from "src/svelte/shared/services/store";
	import { formatAsBearTimeString } from "../services/time-string";
	import Stack from "src/svelte/shared/components/stack.svelte";
	import {
		removeBoldMarkdown,
		removeCodeBlocks,
		removeEmptyLines,
		removeExtraNewLines,
		removeFrontmatter,
		removeItalicsMarkdown,
		removeLevel1Headers,
		removeMarkdownHashes,
		removeMarkdownHighlight,
		removeMarkdownTables,
		removeNewLines,
		removeWikiLinks,
	} from "../services/utils/content-utils";
	import Icon from "src/svelte/shared/components/icon.svelte";
	import { getIconIdForFile } from "../services/file-icon";
	import { PluginEvent } from "src/event/types";
	import { openInCurrentTab } from "../services/open-file";
	import { openContextMenu } from "../services/context-menu";
	import { HOVER_LINK_SOURCE_ID } from "src/constants";
	import { SCREEN_SIZE_LG, SCREEN_SIZE_MD } from "../constants";
	import Spacer from "src/svelte/shared/components/spacer.svelte";

	export let displayName: string;
	export let baseName: string;
	export let extension: string;
	export let path: string;
	export let createdMillis: number;
	export let content: string | null;

	let ref: HTMLElement | null = null;
	let enableFileIcons = false;
	let removeH1: boolean = true;
	let lineClampSmall: number = 2;
	let lineClampMedium: number = 3;
	let lineClampLarge: number = 5;
	let collapseStyle: CollapseStyle = "no-new-lines";
	let currentLineClamp: number = lineClampLarge;

	const dispatch = createEventDispatcher();

	let plugin: VaultExplorerPlugin;
	store.plugin.subscribe((p) => {
		plugin = p;
		enableFileIcons = plugin.settings.enableFileIcons;
		removeH1 = plugin.settings.views.feed.removeH1;
		collapseStyle = plugin.settings.views.feed.collapseStyle;
		lineClampLarge = plugin.settings.views.feed.lineClampLarge;
		lineClampMedium = plugin.settings.views.feed.lineClampMedium;
		lineClampSmall = plugin.settings.views.feed.lineClampSmall;
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
		function handleCollapseFeedContentChange() {
			removeH1 = plugin.settings.views.feed.removeH1;
			collapseStyle = plugin.settings.views.feed.collapseStyle;
			lineClampLarge = plugin.settings.views.feed.lineClampLarge;
			lineClampMedium = plugin.settings.views.feed.lineClampMedium;
			lineClampSmall = plugin.settings.views.feed.lineClampSmall;

			const leafEl = ref?.closest(
				".workspace-leaf-content",
			) as HTMLElement | null;
			if (leafEl) {
				checkLeafWidth(leafEl);
			}
		}

		EventManager.getInstance().on(
			PluginEvent.FEED_CONTENT_SETTING_CHANGE,
			handleCollapseFeedContentChange,
		);
		return () => {
			EventManager.getInstance().off(
				PluginEvent.FEED_CONTENT_SETTING_CHANGE,
				handleCollapseFeedContentChange,
			);
		};
	});

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

	function checkLeafWidth(leafEl: HTMLElement) {
		const { clientWidth } = leafEl;
		if (clientWidth < SCREEN_SIZE_MD) {
			currentLineClamp = lineClampSmall;
		} else if (
			clientWidth >= SCREEN_SIZE_MD &&
			clientWidth < SCREEN_SIZE_LG
		) {
			currentLineClamp = lineClampMedium;
		} else {
			currentLineClamp = lineClampLarge;
		}
	}

	function handleTitleClick() {
		handleCardClick();
	}

	function handleCardClick() {
		openInCurrentTab(plugin, path);
	}

	function handleCardContextMenu(e: Event) {
		const nativeEvent = e as MouseEvent;
		openContextMenu(plugin, path, nativeEvent, {});
	}

	function handleCardMouseOver(e: MouseEvent) {
		const targetEl = e.currentTarget as HTMLElement;
		plugin.app.workspace.trigger("hover-link", {
			event: e,
			linktext: path,
			source: HOVER_LINK_SOURCE_ID,
			targetEl,
			hoverParent: targetEl.parentElement,
		});
	}

	const creationString = formatAsBearTimeString(createdMillis);

	function getDisplayContent(
		content: string | null,
		removeH1: boolean,
		collapseStyle: CollapseStyle,
	) {
		if (content != null) {
			let displayContent = content;
			displayContent = removeFrontmatter(displayContent);

			if (removeH1) {
				displayContent = removeLevel1Headers(displayContent);
			}

			displayContent = removeMarkdownHashes(displayContent);
			displayContent = removeMarkdownTables(displayContent);
			displayContent = removeBoldMarkdown(displayContent);
			displayContent = removeItalicsMarkdown(displayContent);
			displayContent = removeMarkdownHighlight(displayContent);
			displayContent = removeCodeBlocks(displayContent);
			displayContent = removeWikiLinks(displayContent);
			displayContent = removeEmptyLines(displayContent);

			if (collapseStyle === "no-new-lines") {
				displayContent = removeNewLines(displayContent);
			} else {
				displayContent = removeExtraNewLines(displayContent);
			}
			return displayContent;
		}
		return content;
	}

	$: displayContent = getDisplayContent(content, removeH1, collapseStyle);
</script>

<div
	bind:this={ref}
	tabindex="0"
	role="button"
	class="vault-explorer-feed-card"
	on:click={handleCardClick}
	on:keydown={(e) => {
		if (e.key === "Enter" || e.key === " ") {
			handleCardClick();
		}
	}}
	on:contextmenu={(e) => {
		e.preventDefault();
		handleCardContextMenu(e);
	}}
	on:focus={() => {}}
	on:mouseover={handleCardMouseOver}
>
	<div
		tabindex="0"
		role="link"
		class="vault-explorer-feed-card__title"
		on:focus={() => {}}
		on:keydown={(e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				handleTitleClick();
			}
		}}
	>
		<Stack spacing="xs">
			{#if enableFileIcons}
				<Icon iconId={getIconIdForFile(baseName, extension)} />
			{/if}
			<div class="vault-explorer-feed-card__title-text">
				{displayName}
			</div>
		</Stack>
	</div>
	{#if displayContent != null && displayContent.length > 0}
		<Spacer size="sm" />
		<div
			class="vault-explorer-feed-card__content"
			style="-webkit-line-clamp: {currentLineClamp};"
		>
			{@html displayContent}
		</div>
	{/if}
	{#if displayContent != null}
		<Spacer size="md" />
	{/if}
	<div class="vault-explorer-feed-card__creation-time">
		{creationString}
	</div>
</div>

<style>
	.vault-explorer-feed-card {
		padding: 8px;
		border-bottom: 1px solid var(--background-modifier-border);
	}

	.vault-explorer-feed-card:hover {
		background-color: var(--background-modifier-hover);
	}

	.vault-explorer-feed-card:focus-visible {
		box-shadow: 0 0 0 3px var(--background-modifier-focus);
	}

	.vault-explorer-feed-card__title {
		width: 100%;
		color: var(--text-accent);
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
		font-size: var(--font-smaller);
		white-space: pre-wrap;
		text-overflow: ellipsis;
		-webkit-line-clamp: unset;
	}

	.vault-explorer-feed-card__title-text {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		cursor: pointer;
	}

	.vault-explorer-feed-card__creation-time {
		color: var(--text-muted);
		font-size: var(--font-smallest);
	}
</style>
