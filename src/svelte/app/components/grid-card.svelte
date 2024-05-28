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
	import { getScrollAmount } from "../services/scroll-utils";

	export let name: string;
	export let path: string;
	export let url: string | null;
	export let tags: string[] | null;
	export let custom1: string | null;
	export let custom2: string | null;
	export let custom3: string | null;

	let tagContainerRef: HTMLDivElement | null;

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

	function handleScrollLeftClick() {
		if (tagContainerRef) {
			const scrollAmount = getScrollAmount(
				tagContainerRef,
				".vault-explorer-tag",
				"left",
				20,
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
				20,
			);
			tagContainerRef.scrollBy({
				left: scrollAmount,
				behavior: "smooth",
			});
		}
	}

	let showScrollLeftButton = false;
	let showScrollRightButton = false;

	onMount(() => {
		// Function to update the scrollLeft value and the showScrollLeftButton state
		function handleScroll() {
			if (!tagContainerRef) {
				return;
			}
			const { scrollLeft, clientWidth, scrollWidth } = tagContainerRef;
			showScrollLeftButton = scrollLeft > 0;

			//When the scroll box is at the end, the scrollLeft + clientWidth is equal to the scrollWidth
			//Sometimes the scrollLeft + clientWidth is less than 1 than the scrollWidth, in that case,
			//we subtract 1 from the scrollWidth to avoid showing the scroll right button
			showScrollRightButton = scrollLeft + clientWidth < scrollWidth - 1;
		}

		if (tagContainerRef) {
			tagContainerRef.addEventListener("scroll", handleScroll);
			setTimeout(handleScroll, 0);
		}

		return () => {
			if (tagContainerRef) {
				tagContainerRef.removeEventListener("scroll", handleScroll);
			}
		};
	});
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
	<Spacer size="md" direction="vertical" />
	<div class="vault-explorer-grid-card__content">
		{#if tags !== null}
			<Stack spacing="xs">
				{#if showScrollLeftButton}
					<div
						class="vault-explorer-scroll-button vault-explorer-scroll-button--left"
					>
						<IconButton
							ariaLabel="Scroll left"
							noPadding
							iconId="chevron-left"
							on:click={handleScrollLeftClick}
						/>
					</div>
				{/if}
				<div
					class="vault-explorer-grid-card__tags"
					bind:this={tagContainerRef}
				>
					{#each tags as tag}
						<Tag name={tag} />
					{/each}
				</div>
				{#if showScrollRightButton}
					<div
						class="vault-explorer-scroll-button vault-explorer-scroll-button--right"
					>
						<IconButton
							ariaLabel="Scroll right"
							noPadding
							iconId="chevron-right"
							on:click={handleScrollRightClick}
						/>
					</div>
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

	/**
	.vault-explorer-property-label {
		margin-left: 8px;
		font-size: var(--font-smallest);
		color: var(--text-muted);
	} */

	.vault-explorer-scroll-button {
		position: absolute;
		background-color: var(--background-primary);
		z-index: 1;
		width: 20px;
		height: 20px;
	}

	.vault-explorer-scroll-button--left {
		left: 0;
	}

	.vault-explorer-scroll-button--right {
		right: 0;
	}
</style>
