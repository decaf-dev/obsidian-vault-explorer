<script lang="ts">
	import IconButton from "../../shared/components/icon-button.svelte";
	import Tag from "../../shared/components/tag.svelte";
	import Property from "../../shared/components/property.svelte";
	import VaultExplorerPlugin from "src/main";
	import store from "../../shared/services/store";
	import Wrap from "src/svelte/shared/components/wrap.svelte";
	import Stack from "src/svelte/shared/components/stack.svelte";
	import { createEventDispatcher, onMount } from "svelte";
	import { WordBreak } from "src/types";
	import { HOVER_LINK_SOURCE_ID } from "src/constants";
	import EventManager from "src/event/event-manager";
	import Icon from "src/svelte/shared/components/icon.svelte";
	import { getIconIdForFile } from "../services/file-icon";
	import { fetchSocialImage } from "../services/social-media-image";
	import { PluginEvent } from "src/event/types";
	import { openContextMenu } from "../services/context-menu";
	import { openInCurrentTab } from "../services/open-file";
	import Flex from "src/svelte/shared/components/flex.svelte";
	import { isHttpsLink } from "../services/utils/url-utils";
	import { isImageUrl } from "../services/utils/image-utils";
	import Spacer from "src/svelte/shared/components/spacer.svelte";

	export let displayName: string;
	export let path: string;
	export let baseName: string;
	export let extension: string;
	export let url: string | null;
	export let imageUrl: string | null;
	export let tags: string[] | null;
	export let custom1: string | null;
	export let custom2: string | null;
	export let custom3: string | null;
	export let isFavorite: boolean | null;

	let plugin: VaultExplorerPlugin;
	let wordBreak: WordBreak = "normal";
	let enableFileIcons: boolean = false;
	let loadSocialMediaImage: boolean = true;
	let imgSrc: string | null = null;

	store.plugin.subscribe((p) => {
		plugin = p;
		wordBreak = plugin.settings.titleWrapping;
		enableFileIcons = plugin.settings.enableFileIcons;
		loadSocialMediaImage = plugin.settings.views.grid.loadSocialMediaImage;
	});

	const dispatch = createEventDispatcher();

	onMount(() => {
		if (imageUrl) {
			if (!isHttpsLink(imageUrl) || isImageUrl(imageUrl)) {
				imgSrc = imageUrl;
			}
		}

		if (loadSocialMediaImage) {
			loadSocialImage(imageUrl);
		}
	});

	onMount(() => {
		function handleLoadSocialMediaImageChange() {
			const newValue = plugin.settings.views.grid.loadSocialMediaImage;
			loadSocialMediaImage = newValue;
			if (newValue) {
				loadSocialImage(imageUrl);
			} else {
				clearSocialImage(imageUrl);
			}
		}

		EventManager.getInstance().on(
			PluginEvent.LOAD_SOCIAL_MEDIA_IMAGE_SETTING_CHANGE,
			handleLoadSocialMediaImageChange,
		);
		return () => {
			EventManager.getInstance().off(
				PluginEvent.LOAD_SOCIAL_MEDIA_IMAGE_SETTING_CHANGE,
				handleLoadSocialMediaImageChange,
			);
		};
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

	function handleUrlClick(e: CustomEvent) {
		const { nativeEvent } = e.detail;
		nativeEvent.stopPropagation();
		if (url != null) {
			window.open(url, "_blank");
		}
	}

	async function loadSocialImage(imageUrl: string | null) {
		if (imageUrl == null) return;

		//If it's a link but not an image, it's a plain url
		//in that case, we want to load the social media image
		if (isHttpsLink(imageUrl) && !isImageUrl(imageUrl)) {
			imgSrc = await fetchSocialImage(imageUrl);
		}
	}

	function clearSocialImage(imageUrl: string | null) {
		if (imageUrl == null) return;
		//If it's a link but not an image, it's a plain url
		//in that case, we want to clear the social media image
		if (isHttpsLink(imageUrl) && !isImageUrl(imageUrl)) {
			imgSrc = null;
		}
	}

	function handleCardClick() {
		openInCurrentTab(plugin, path);
	}

	function handleFavoriteChange(filePath: string, value: boolean) {
		dispatch("favoritePropertyChange", { filePath, value });
	}

	function handleCardContextMenu(e: Event) {
		const nativeEvent = e as MouseEvent;
		openContextMenu(plugin, path, nativeEvent, {
			isFavorite,
			onFavoriteChange: handleFavoriteChange,
		});
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

	function handleTitleClick() {
		handleCardClick();
	}

	function handleTitleContextMenu(e: Event) {
		handleCardContextMenu(e);
	}

	function handleTitleMouseOver(e: MouseEvent) {
		handleCardMouseOver(e);
	}

	$: hasBodyContent =
		tags != null || custom1 != null || custom2 != null || custom3 != null;
</script>

<div
	tabindex="0"
	role="button"
	class="vault-explorer-grid-card vault-explorer-grid-card--interactive"
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
	on:mouseover
>
	<div class="vault-explorer-grid-card__cover">
		{#if imgSrc !== null}
			<!-- svelte-ignore a11y-missing-attribute -->
			<img class="vault-explorer-grid-card__image" src={imgSrc} />
		{/if}
		{#if isFavorite === true}
			<div class="vault-explorer-grid-card__favorite">
				<Flex
					justify="center"
					align="center"
					width="100%"
					height="100%"
				>
					<Icon iconId="star" ariaLabel="Favorite" />
				</Flex>
			</div>
		{/if}
	</div>
	<div class="vault-explorer-grid-card__content">
		<div class="vault-explorer-grid-card__head">
			<div
				tabindex="0"
				role="link"
				class="vault-explorer-grid-card__title"
				on:focus={() => {}}
				on:click={(e) => {
					e.preventDefault();
					handleTitleClick();
				}}
				on:contextmenu={(e) => {
					e.preventDefault();
					handleTitleContextMenu(e);
				}}
				on:keydown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						handleTitleClick();
					}
				}}
				on:mouseover={handleTitleMouseOver}
			>
				<Stack spacing="xs" width="max-content">
					{#if enableFileIcons}
						<Icon iconId={getIconIdForFile(baseName, extension)} />
					{/if}
					<div class="vault-explorer-grid-card__title-text">
						{displayName}
					</div>
				</Stack>
			</div>
			{#if url !== null}
				<IconButton
					iconId="external-link"
					ariaLabel="Open in browser"
					noPadding
					on:click={handleUrlClick}
				/>
			{/if}
		</div>
		{#if tags !== null}
			<Spacer size="md" />
			<div class="vault-explorer-grid-card__tags">
				<Wrap spacingX="sm" spacingY="sm">
					{#each tags as tag}
						<Tag name={tag} />
					{/each}
				</Wrap>
			</div>
		{/if}
		{#if custom1 !== null || custom2 !== null || custom3 !== null}
			<div class="vault-explorer-grid-card__properties">
				<Spacer size="md" />
				<Wrap spacingX="sm" spacingY="sm"
					>{#if custom1 !== null}<Property
							name={plugin.settings.properties.custom1}
							value={custom1}
						/>{/if}
					{#if custom2 !== null}<Property
							name={plugin.settings.properties.custom2}
							value={custom2}
						/>{/if}
					{#if custom3 !== null}<Property
							name={plugin.settings.properties.custom3}
							value={custom3}
						/>{/if}
				</Wrap>
			</div>
		{/if}
	</div>
</div>

<style>
	.vault-explorer-grid-card {
		width: 100%;
		max-width: 425px;
		box-shadow: var(--shadow-s);
		border-radius: var(--radius-m);
	}
	/* 
	.vault-explorer-grid-card:hover {
		background-color: var(--background-modifier-hover);
	} */

	.vault-explorer-grid-card:focus-visible {
		box-shadow: 0 0 0 3px var(--background-modifier-border-focus);
	}

	.vault-explorer-grid-card__cover {
		width: 100%;
		height: 150px;
		background-color: var(--background-modifier-border);
		border-top-left-radius: var(--radius-m);
		border-top-right-radius: var(--radius-m);
		position: relative;
	}

	.vault-explorer-grid-card__favorite {
		position: absolute;
		top: 8px;
		right: 8px;
		width: 20px;
		height: 20px;
		background-color: var(--background-primary);
		border-radius: 50%;
	}

	.vault-explorer-grid-card__image {
		width: 100%;
		height: 150px;
		object-fit: cover;
		border-top-left-radius: var(--radius-m);
		border-top-right-radius: var(--radius-m);
	}

	.vault-explorer-grid-card__content {
		padding: 8px 16px;
	}

	.vault-explorer-grid-card__head {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		column-gap: 0.5rem;
	}

	.vault-explorer-grid-card__title {
		flex-grow: 1;
		min-width: 0;
		color: var(--text-accent);
	}

	.vault-explorer-grid-card__title:focus-visible {
		box-shadow: 0 0 0 3px var(--background-modifier-border-focus);
	}

	.vault-explorer-grid-card__title-text {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		cursor: pointer;
	}
</style>
