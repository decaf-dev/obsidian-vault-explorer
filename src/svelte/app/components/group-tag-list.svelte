<script lang="ts">
	import { TFilterGroup } from "src/types";
	import GroupTag from "./group-tag.svelte";
	import Stack from "src/svelte/shared/components/stack.svelte";
	import ScrollButton from "src/svelte/shared/components/scroll-button.svelte";
	import { getScrollAmount } from "../services/utils/scroll-utils";
	import { onMount } from "svelte";
	import store from "src/svelte/shared/services/store";
	import VaultExplorerPlugin from "src/main";
	import EventManager from "src/event/event-manager";

	export let groups: TFilterGroup[] = [];

	let plugin: VaultExplorerPlugin;
	let tagContainerRef: HTMLDivElement | null;
	let enableScrollButtons = false;
	let showScrollLeftButton = false;
	let showScrollRightButton = false;

	onMount(() => {
		store.plugin.subscribe((value) => {
			plugin = value;
			enableScrollButtons = plugin.settings.enableScrollButtons;
		});
	});

	onMount(() => {
		function handleScrollButtonSettingChange() {
			const newValue = plugin.settings.enableScrollButtons;
			enableScrollButtons = newValue;

			if (newValue === false) {
				showScrollLeftButton = false;
				showScrollRightButton = false;
				tagContainerRef?.removeEventListener("scroll", handleScroll);
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

	function handleScroll() {
		if (!tagContainerRef) return;

		const { scrollLeft, clientWidth, scrollWidth } = tagContainerRef;
		showScrollLeftButton = scrollLeft > 0;

		// When the scroll box is at the end, the scrollLeft + clientWidth is equal to the scrollWidth
		// To account for minor discrepancies, we use Math.round to round the result
		showScrollRightButton =
			Math.round(scrollLeft + clientWidth) < scrollWidth;
	}

	function handleScrollLeftClick() {
		if (tagContainerRef) {
			const scrollAmount = getScrollAmount(
				tagContainerRef,
				".vault-explorer-group-tag",
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
				".vault-explorer-group-tag",
				"right",
			);
			tagContainerRef.scrollBy({
				left: scrollAmount,
				behavior: "smooth",
			});
		}
	}
</script>

<div class="vault-explorer-group-tag-list">
	<div
		class="vault-explorer-group-tag-list__container"
		bind:this={tagContainerRef}
	>
		{#if showScrollLeftButton}
			<ScrollButton
				type="group-tag"
				direction="left"
				on:click={handleScrollLeftClick}
			/>
		{/if}
		<Stack spacing="sm">
			{#each groups as group (group.id)}
				<GroupTag
					id={group.id}
					name={group.name}
					isSelected={group.isEnabled}
					isSticky={group.isSticky}
					on:groupClick
					on:groupDrop
					on:groupDragOver
					on:groupDragStart
				/>
			{/each}
		</Stack>
		{#if showScrollRightButton}
			<ScrollButton
				type="group-tag"
				direction="right"
				on:click={handleScrollRightClick}
			/>
		{/if}
	</div>
</div>

<style>
	.vault-explorer-group-tag-list {
		position: relative;
	}

	.vault-explorer-group-tag-list__container {
		max-width: 325px;
		overflow-x: auto;
	}

	.vault-explorer-group-tag-list__container::-webkit-scrollbar {
		display: none;
	}
</style>
