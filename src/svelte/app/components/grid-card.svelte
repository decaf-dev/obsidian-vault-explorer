<script lang="ts">
	import { MarkdownView } from "obsidian";
	import IconButton from "../../shared/components/icon-button.svelte";
	import Tag from "../../shared/components/tag.svelte";
	import Spacer from "../../shared/components/spacer.svelte";
	import Property from "../../shared/components/property.svelte";
	import VaultExplorerPlugin from "src/main";
	import store from "../../shared/services/store";
	import Wrap from "src/svelte/shared/components/wrap.svelte";
	import Stack from "src/svelte/shared/components/stack.svelte";
	import { onMount } from "svelte";
	import { getScrollAmount } from "../services/utils/scroll-utils";
	import { WordBreak } from "src/types";
	import { HOVER_LINK_SOURCE_ID } from "src/constants";
	import EventManager from "src/event/event-manager";
	import ScrollButton from "src/svelte/shared/components/scroll-button.svelte";

	export let name: string;
	export let path: string;
	export let url: string | null;
	export let tags: string[] | null;
	export let custom1: string | null;
	export let custom2: string | null;
	export let custom3: string | null;

	let tagContainerRef: HTMLDivElement | null;
	let wordBreak: WordBreak = "normal";

	let enableScrollButtons: boolean = false;
	let renderScrollLeftButton = false;
	let renderScrollRightButton = false;

	let plugin: VaultExplorerPlugin;
	store.plugin.subscribe((p) => {
		plugin = p;
		wordBreak = plugin.settings.titleWrapping;
		enableScrollButtons = plugin.settings.enableScrollButtons;
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

	onMount(() => {
		function handleScrollButtonSettingChange() {
			const newValue = plugin.settings.enableScrollButtons;
			enableScrollButtons = newValue;

			if (newValue === false) {
				renderScrollLeftButton = false;
				renderScrollRightButton = false;
			}
		}

		EventManager.getInstance().on(
			"scroll-buttons-setting-change",
			handleScrollButtonSettingChange,
		);

		return () => {
			EventManager.getInstance().off(
				"scroll-buttons-setting-change",
				handleScrollButtonSettingChange,
			);
		};
	});

	onMount(() => {
		function addScrollListener() {
			if (tagContainerRef && enableScrollButtons) {
				tagContainerRef.addEventListener("scroll", handleScroll);
				requestAnimationFrame(handleScroll);
			}
		}

		addScrollListener();

		return () => {
			if (tagContainerRef && enableScrollButtons) {
				tagContainerRef.removeEventListener("scroll", handleScroll);
			}
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

	function handleUrlClick() {
		if (url != null) {
			window.open(url, "_blank");
		}
	}

	function handleScrollLeftClick() {
		if (tagContainerRef) {
			const scrollAmount = getScrollAmount(
				tagContainerRef,
				".vault-explorer-tag",
				"left",
			);
			tagContainerRef.scrollBy({
				left: -scrollAmount,
				behavior: "smooth",
			});
		}
	}

	function handleScrollRightClick() {
		if (tagContainerRef) {
			const scrollAmount = getScrollAmount(
				tagContainerRef,
				".vault-explorer-tag",
				"right",
			);
			tagContainerRef.scrollBy({
				left: scrollAmount,
				behavior: "smooth",
			});
		}
	}

	function handleScroll() {
		if (!tagContainerRef) return;

		const { scrollLeft, clientWidth, scrollWidth } = tagContainerRef;
		renderScrollLeftButton = scrollLeft > 0;

		// When the scroll box is at the end, the scrollLeft + clientWidth is equal to the scrollWidth
		// To account for minor discrepancies, we use Math.round to round the result
		renderScrollRightButton =
			Math.round(scrollLeft + clientWidth) < scrollWidth;
	}

	$: if (tagContainerRef) {
		if (enableScrollButtons) {
			tagContainerRef.addEventListener("scroll", handleScroll);
			handleScroll();
		} else {
			tagContainerRef.removeEventListener("scroll", handleScroll);
		}
	}
</script>

<div class="vault-explorer-grid-card">
	<div class="vault-explorer-grid-card__header">
		<div
			tabindex="0"
			role="link"
			class="vault-explorer-grid-card__title"
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
		{#if url !== null}
			<IconButton iconId="external-link" on:click={handleUrlClick} />
		{/if}
	</div>
	<Spacer size="md" direction="vertical" />
	<div class="vault-explorer-grid-card__content">
		{#if tags !== null}
			<Stack spacing="xs">
				{#if renderScrollLeftButton}
					<ScrollButton
						type="tag"
						direction="left"
						on:click={handleScrollLeftClick}
					/>
				{/if}
				<div
					class="vault-explorer-grid-card__tags"
					bind:this={tagContainerRef}
				>
					{#each tags as tag}
						<Tag name={tag} />
					{/each}
				</div>
				{#if renderScrollRightButton}
					<ScrollButton
						type="tag"
						direction="right"
						on:click={handleScrollRightClick}
					/>
				{/if}
			</Stack>
		{/if}
		<!-- {#if custom1 !== null || custom2 !== null || custom3 !== null}
			<Spacer size="sm" direction="vertical" />
		{/if} -->
		<Wrap spacingX="xs" spacingY="xs"
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
		position: relative;
		display: flex;
		flex-direction: column;
		row-gap: 0.5rem;
	}

	.vault-explorer-grid-card__title {
		cursor: pointer;
		color: var(--text-accent);
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.vault-explorer-grid-card__title:focus-visible {
		box-shadow: 0 0 0 3px var(--background-modifier-border-focus);
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

	/**
	.vault-explorer-property-label {
		margin-left: 8px;
		font-size: var(--font-smallest);
		color: var(--text-muted);
	} */
</style>
