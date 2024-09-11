<script lang="ts">
	import Tag from "../../shared/components/tag.svelte";
	import Property from "../../shared/components/property.svelte";
	import VaultExplorerPlugin from "src/main";
	import store from "../../shared/services/store";
	import Wrap from "src/svelte/shared/components/wrap.svelte";
	import Stack from "src/svelte/shared/components/stack.svelte";
	import { createEventDispatcher, onMount } from "svelte";
	import { HOVER_LINK_SOURCE_ID } from "src/constants";
	import EventManager from "src/event/event-manager";
	import Icon from "src/svelte/shared/components/icon.svelte";
	import { getIconIdForFile } from "../services/file-icon";
	import { PluginEvent } from "src/event/types";
	import { openContextMenu } from "../services/context-menu";
	import { openInCurrentTab } from "../services/open-file";
	import { getDomainFromUrl } from "../services/utils/url-utils";
	import Spacer from "src/svelte/shared/components/spacer.svelte";
	import Divider from "src/svelte/shared/components/divider.svelte";
	import { fetchSocialMediaImage } from "../services/fetch-social-media-image";
	import {
		getSMICacheEntry,
		isSMICacheEntryExpired,
		putSMICacheEntry,
	} from "../services/smi-cache";
	import { CoverImageFit } from "src/types";
	import Logger from "js-logger";

	type SocialMediaImageResult = {
		status: "SUCCESS" | "NOT_FOUND" | "EXPIRED" | "NO_IMAGE";
		url?: string; // Only present when status is 'SUCCESS'
	};

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
	export let coverImageFit: CoverImageFit;

	let plugin: VaultExplorerPlugin;
	let enableFileIcons: boolean = false;
	let loadSocialMediaImage: boolean = true;
	let imgSrc: string | null = null;
	let isImageLoaded = false;

	store.plugin.subscribe((p) => {
		plugin = p;
		enableFileIcons = plugin.settings.enableFileIcons;
		loadSocialMediaImage = plugin.settings.views.grid.loadSocialMediaImage;
	});

	const dispatch = createEventDispatcher();

	onMount(() => {
		function handleLoadSocialMediaImageChange() {
			const newValue = plugin.settings.views.grid.loadSocialMediaImage;
			loadSocialMediaImage = newValue;
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

	function handleUrlClick(e: Event) {
		e.stopPropagation();
	}

	function handleCardClick() {
		openInCurrentTab(plugin, path);
	}

	function handleCoverImageFitChange(filePath: string, value: CoverImageFit) {
		dispatch("coverImageFitChange", { filePath, value });
	}

	function handleCardContextMenu(e: Event) {
		const nativeEvent = e as MouseEvent;

		const showCoverImageOptions = path.endsWith(".md");
		openContextMenu(plugin, path, nativeEvent, {
			coverImageFit: showCoverImageOptions ? coverImageFit : undefined,
			onCoverImageFitChange: showCoverImageOptions
				? handleCoverImageFitChange
				: undefined,
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

	function handleImageLoad() {
		isImageLoaded = true;
	}

	async function handleImageError(event: Event) {
		Logger.trace({
			fileName: "grid-card.svelte",
			functionName: "handleImageError",
			message: "called",
		});

		const target = event.target as HTMLImageElement;
		target.onerror = null; // Prevent infinite loop

		Logger.debug(
			{
				fileName: "grid-card.svelte",
				functionName: "handleImageError",
				message: "target.src",
			},
			{
				src: target.src,
			},
		);

		let websiteUrl = target.src;
		if (websiteUrl.endsWith("/")) {
			websiteUrl = websiteUrl.slice(0, -1); // Remove the trailing slash
		}
		Logger.debug(
			{
				fileName: "grid-card.svelte",
				functionName: "handleImageError",
				message: "websiteUrl",
			},
			{
				websiteUrl,
			},
		);

		if (loadSocialMediaImage) {
			const socialUrl = await fetchSocialMediaImage(websiteUrl);
			if (socialUrl) {
				await putSMICacheEntry(websiteUrl, socialUrl);
				target.src = socialUrl;
			} else {
				await putSMICacheEntry(websiteUrl, null);
			}
		}
	}

	async function getCachedSocialMediaImageUrl(
		websiteUrl: string,
	): Promise<SocialMediaImageResult> {
		const entry = await getSMICacheEntry(websiteUrl);

		if (entry) {
			const { socialMediaImageUrl } = entry;

			if (socialMediaImageUrl) {
				const isExpired = await isSMICacheEntryExpired(entry);
				if (!isExpired) {
					return { status: "SUCCESS", url: socialMediaImageUrl };
				} else {
					return { status: "EXPIRED" }; // Image found but expired
				}
			} else {
				return { status: "NO_IMAGE" }; // Social image was fetched but doesn't exist
			}
		}

		return { status: "NOT_FOUND" }; // Image not cached
	}

	$: if (imageUrl) {
		isImageLoaded = false;
		getCachedSocialMediaImageUrl(imageUrl).then((result) => {
			Logger.debug(
				{
					fileName: "grid-card.svelte",
					functionName: "getCachedSocialMediaImage",
					message: "result",
				},
				{
					result,
				},
			);

			const { status, url } = result;
			if (status === "SUCCESS") {
				imgSrc = url!;
			} else if (status === "EXPIRED" || status === "NOT_FOUND") {
				imgSrc = imageUrl;
			} else if (status === "NO_IMAGE") {
				//Do nothing
				//This is for websites like x.com where the social image is not found
				//We don't want to keep trying to fetch the image
			}
		});
	}

	$: hasFooterContent =
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
	on:mouseover={handleCardMouseOver}
>
	<div class="vault-explorer-grid-card__cover">
		{#if imgSrc !== null}
			<!-- svelte-ignore a11y-missing-attribute -->
			<img
				class="vault-explorer-grid-card__image"
				src={imgSrc}
				style="display: {isImageLoaded
					? 'block'
					: 'none'}; object-fit: {coverImageFit};"
				on:load={handleImageLoad}
				on:error={handleImageError}
			/>
		{/if}
		{#if imageUrl === null}
			<div class="vault-explorer-grid-card__image"></div>
		{/if}
	</div>
	<div class="vault-explorer-grid-card__body">
		<div
			tabindex="0"
			role="link"
			class="vault-explorer-grid-card__title"
			on:focus={() => {}}
			on:click={(e) => {
				e.preventDefault();
				handleTitleClick();
			}}
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
				<div class="vault-explorer-grid-card__title-text">
					{displayName}
				</div>
			</Stack>
		</div>
		{#if url !== null}
			<Spacer size="xs" />
			<Stack spacing="xs" align="center"
				><Icon iconId="link" size="xs" /><a
					class="vault-explorer-grid-card__url"
					href={url}
					target="_blank"
					rel="noopener"
					on:click={handleUrlClick}>{getDomainFromUrl(url)}</a
				></Stack
			>
		{/if}
	</div>
	{#if hasFooterContent}<Divider />{/if}
	{#if hasFooterContent}
		<div class="vault-explorer-grid-card__footer">
			{#if custom1 !== null || custom2 !== null || custom3 !== null}
				<div class="vault-explorer-grid-card__properties">
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
			{#if (custom1 !== null || custom2 !== null || custom3 !== null) && tags !== null}
				<Spacer size="sm" />
			{/if}
			{#if tags !== null}
				<div class="vault-explorer-grid-card__tags">
					<Wrap spacingX="sm" spacingY="sm">
						{#each tags as tag}
							<Tag name={tag} variant="unstyled" />
						{/each}
					</Wrap>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.vault-explorer-grid-card {
		width: 100%;
		max-width: 425px;
		box-shadow: var(--shadow-s);
		border-radius: var(--radius-m);
	}

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

	.vault-explorer-grid-card__image {
		width: 100%;
		height: 150px;
		border-top-left-radius: var(--radius-m);
		border-top-right-radius: var(--radius-m);
	}

	.vault-explorer-grid-card__body {
		padding: 8px 16px;
	}

	.vault-explorer-grid-card__footer {
		padding: 12px 16px;
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

	.vault-explorer-grid-card__url {
		color: var(--text-muted);
		text-decoration: none;
		font-size: var(--font-small);
	}

	.vault-explorer-grid-card__url:hover {
		color: var(--text-faint);
	}
</style>
