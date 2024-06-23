<script lang="ts">
	import { FilterGroup } from "src/types";
	import GroupTag from "./group-tag.svelte";
	import Stack from "src/svelte/shared/components/stack.svelte";
	import ScrollButton from "src/svelte/shared/components/scroll-button.svelte";
	import { getScrollAmount } from "../services/scroll-utils";
	import { onMount } from "svelte";

	export let groups: FilterGroup[] = [];
	let tagContainerRef: HTMLDivElement | null;

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

	let showScrollLeftButton = false;
	let showScrollRightButton = false;
</script>

<div class="vault-explorer-group-tag-list" style="position: relative">
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
	.vault-explorer-group-tag-list__container {
		max-width: 325px;
		overflow-x: auto;
	}

	.vault-explorer-group-tag-list__container::-webkit-scrollbar {
		display: none;
	}
</style>
