<script lang="ts">
	import { onMount } from "svelte";
	import { FileInteractionStyle, WordBreak } from "src/types";
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
	import { openInCurrentTab } from "../services/open-file";
	import FeedCardContainer from "./feed-card-container.svelte";
	import { openContextMenu } from "../services/context-menu";
	import FeedCardTitle from "./feed-card-title.svelte";

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
	let fileInteractionStyle: FileInteractionStyle = "content";

	let plugin: VaultExplorerPlugin;
	store.plugin.subscribe((value) => {
		plugin = value;
		wordBreak = plugin.settings.titleWrapping;
		enableFileIcons = plugin.settings.enableFileIcons;
		collapseContent = plugin.settings.views.feed.collapseContent;
		fileInteractionStyle = plugin.settings.fileInteractionStyle;
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
		function handleFileInteractionStyleChange() {
			fileInteractionStyle = plugin.settings.fileInteractionStyle;
		}

		EventManager.getInstance().on(
			PluginEvent.FILE_INTERACTION_STYLE,
			handleFileInteractionStyleChange,
		);
		return () => {
			EventManager.getInstance().off(
				PluginEvent.FILE_INTERACTION_STYLE,
				handleFileInteractionStyleChange,
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

	function handleTitleClick() {
		handleCardClick();
	}

	function handleCardClick() {
		openInCurrentTab(plugin, path);
	}

	function handleCardContextMenu(e: CustomEvent) {
		const { nativeEvent } = e.detail;
		openContextMenu(plugin, nativeEvent, path);
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

<FeedCardContainer
	{fileInteractionStyle}
	bind:ref
	on:click={handleCardClick}
	on:contextmenu={handleCardContextMenu}
>
	<Stack spacing="sm" direction="column">
		<FeedCardTitle
			{fileInteractionStyle}
			{wordBreak}
			on:click={handleTitleClick}
		>
			<Stack spacing="xs">
				{#if enableFileIcons}
					<Icon iconId={getIconIdForFile(baseName, extension)} />
				{/if}
				<span>{displayName}</span>
			</Stack>
		</FeedCardTitle>
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
</FeedCardContainer>

<style>
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
