<script lang="ts">
	import { TFilterGroup } from "src/types";
	import _ from "lodash";
	import VaultExplorerPlugin from "src/main";
	import store from "src/svelte/shared/services/store";
	import { onMount } from "svelte";
	import Wrap from "src/svelte/shared/components/wrap.svelte";
	import EventManager from "src/event/event-manager";
	import { PluginEvent } from "src/event/types";
	import FilterGroup from "./filter-group.svelte";

	export let groups: TFilterGroup[] = [];

	let containerRef: HTMLDivElement | null = null;
	let shouldWrapFilterGroups: boolean = false;

	const debounceSaveContainerWidth = _.debounce(saveContainerWidth, 200);

	let plugin: VaultExplorerPlugin;

	store.plugin.subscribe((p) => {
		plugin = p;
		shouldWrapFilterGroups = plugin.settings.shouldWrapFilterGroups;
	});

	onMount(() => {
		function handleWrapFilterGroupsSettingChange() {
			shouldWrapFilterGroups = plugin.settings.shouldWrapFilterGroups;
		}

		EventManager.getInstance().on(
			PluginEvent.WRAP_FILTER_GROUPS_SETTING_CHANGE,
			handleWrapFilterGroupsSettingChange,
		);
		return () => {
			EventManager.getInstance().off(
				PluginEvent.WRAP_FILTER_GROUPS_SETTING_CHANGE,
				handleWrapFilterGroupsSettingChange,
			);
		};
	});

	onMount(() => {
		let resizeObserver: ResizeObserver;

		if (containerRef) {
			containerRef.style.width = plugin.settings.filterGroupsWidth;

			resizeObserver = new ResizeObserver(() => {
				debounceSaveContainerWidth();
			});
			resizeObserver.observe(containerRef);
		}

		return () => {
			resizeObserver?.disconnect();
		};
	});

	async function saveContainerWidth() {
		if (containerRef) {
			plugin.settings.filterGroupsWidth = containerRef.style.width;
			await plugin.saveSettings();
		}
	}
</script>

<div class="vault-explorer-filter-group-list">
	<div
		class="vault-explorer-filter-group-list__container"
		bind:this={containerRef}
	>
		{#if groups.length > 0}
			<Wrap
				spacingX="sm"
				spacingY="sm"
				wrap={shouldWrapFilterGroups ? "wrap" : "nowrap"}
			>
				{#each groups as group (group.id)}
					<FilterGroup
						id={group.id}
						name={group.name}
						isSelected={group.isEnabled}
						isSticky={group.isSticky}
						on:groupClick
						on:groupDrop
						on:groupDragOver
						on:groupDragStart
						on:groupContextMenu
					/>
				{/each}
			</Wrap>
		{/if}
		{#if groups.length === 0}
			<span class="vault-explorer-empty-label">No groups</span>
		{/if}
	</div>
</div>

<style>
	.vault-explorer-filter-group-list {
		width: 100%;
		position: relative;
	}

	.vault-explorer-filter-group-list__container {
		padding-bottom: 8px;
		resize: horizontal;
		overflow-x: auto;
	}

	.vault-explorer-empty-label {
		color: var(--text-faint);
		font-size: var(--font-smaller);
	}
</style>
