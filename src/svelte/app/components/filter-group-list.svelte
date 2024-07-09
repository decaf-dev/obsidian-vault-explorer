<script lang="ts">
	import { FlexWrap, TFilterGroup } from "src/types";
	import GroupTag from "./group-tag.svelte";
	import _ from "lodash";
	import VaultExplorerPlugin from "src/main";
	import store from "src/svelte/shared/services/store";
	import { onMount } from "svelte";
	import Wrap from "src/svelte/shared/components/wrap.svelte";
	import EventManager from "src/event/event-manager";

	export let groups: TFilterGroup[] = [];

	let startX: number;
	let startWidth: number;
	let containerRef: HTMLDivElement | null = null;
	let handleRef: HTMLDivElement | null = null;
	let filterGroupsWrapping: FlexWrap = "nowrap";

	let plugin: VaultExplorerPlugin;

	store.plugin.subscribe((p) => {
		plugin = p;
		filterGroupsWrapping = plugin.settings.filterGroupsWrapping;
	});

	onMount(() => {
		function handleFilterGroupsWrappingSettingChange() {
			filterGroupsWrapping = plugin.settings.filterGroupsWrapping;
		}

		EventManager.getInstance().on(
			"filter-groups-wrapping-setting-change",
			handleFilterGroupsWrappingSettingChange,
		);
		return () => {
			EventManager.getInstance().off(
				"filter-groups-wrapping-setting-change",
				handleFilterGroupsWrappingSettingChange,
			);
		};
	});

	onMount(() => {
		if (containerRef != null)
			containerRef.style.maxWidth =
				plugin.settings.filterGroupsWidth + "px";
	});

	function onMouseDown(event: MouseEvent) {
		if (!containerRef) return;
		if (!handleRef) return;

		startX = event.clientX;
		startWidth = plugin.settings.filterGroupsWidth;

		// startWidth = parseInt(window.getComputedStyle(containerRef).width, 10);

		document.documentElement.addEventListener("mousemove", onMouseMove);
		document.documentElement.addEventListener("mouseup", onMouseUp);

		// Prevent pointer events on draggable elements
		containerRef.style.pointerEvents = "none";
		handleRef.classList.add("vault-explorer-resize-handle--dragging");
	}

	function onMouseMove(event: MouseEvent) {
		if (!containerRef) return;
		containerRef.style.maxWidth =
			startWidth + event.clientX - startX + "px";
	}

	async function onMouseUp() {
		document.documentElement.removeEventListener("mousemove", onMouseMove);
		document.documentElement.removeEventListener("mouseup", onMouseUp);

		if (containerRef && handleRef) {
			// Re-enable pointer events on draggable elements
			containerRef.style.pointerEvents = "auto";
			handleRef.classList.remove(
				"vault-explorer-resize-handle--dragging",
			);
			plugin.settings.filterGroupsWidth = parseInt(
				containerRef.style.maxWidth.replace("px", ""),
			);
			await plugin.saveSettings();
		}
	}
</script>

<div class="vault-explorer-filter-group-list" bind:this={containerRef}>
	<div class="vault-explorer-filter-group-list__container">
		{#if groups.length > 0}
			<Wrap spacingX="sm" spacingY="sm" wrap={filterGroupsWrapping}>
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
			</Wrap>
		{/if}
		{#if groups.length === 0}
			<span class="vault-explorer-empty-label">No groups</span>
		{/if}
	</div>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="vault-explorer-resize-handle"
		bind:this={handleRef}
		on:mousedown={onMouseDown}
	></div>
</div>

<style>
	.vault-explorer-filter-group-list {
		width: 100%;
		position: relative;
	}

	.vault-explorer-filter-group-list__container {
		margin-right: 3px;
		overflow: scroll;
	}

	.vault-explorer-filter-group-list__container::-webkit-scrollbar {
		display: none;
	}

	.vault-explorer-empty-label {
		color: var(--text-faint);
		font-size: var(--font-smaller);
	}

	.vault-explorer-resize-handle {
		position: absolute;
		z-index: 1;
		height: 100%;
		top: 0;
		right: 0;
		width: 3px;
		border-right: var(--divider-width) solid var(--divider-color);
		cursor: col-resize;
		transition: border-color 200ms ease-in-out;
	}

	.vault-explorer-resize-handle:hover {
		background-color: var(--divider-color-hover);
		border-color: var(--divider-color-hover);
	}

	:global(
			.vault-explorer-resize-handle.vault-explorer-resize-handle--dragging
		) {
		background-color: var(--divider-color-hover);
		border-color: var(--divider-color-hover);
	}
</style>
