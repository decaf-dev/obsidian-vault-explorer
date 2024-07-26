<script lang="ts">
	import VaultExplorerPlugin from "src/main";
	import store from "../../shared/services/store";
	import Tag from "src/svelte/shared/components/tag.svelte";
	import Wrap from "src/svelte/shared/components/wrap.svelte";
	import Icon from "src/svelte/shared/components/icon.svelte";
	import Stack from "src/svelte/shared/components/stack.svelte";
	import { getIconIdForFile } from "../services/file-icon";
	import { createEventDispatcher, onMount } from "svelte";
	import EventManager from "src/event/event-manager";
	import { PluginEvent } from "src/event/types";
	import { openContextMenu } from "../services/context-menu";
	import { openInCurrentTab } from "../services/open-file";
	import { HOVER_LINK_SOURCE_ID } from "src/constants";
	import { SCREEN_SIZE_MD } from "../constants";

	export let displayName: string;
	export let baseName: string;
	export let extension: string;
	export let path: string;
	export let tags: string[] | null;
	export let isFavorite: boolean | null;

	let enableFileIcons: boolean = false;
	let isSmallScreenSize: boolean = false;
	let ref: HTMLElement | null = null;
	let showTags: boolean = true;
	let plugin: VaultExplorerPlugin;

	const dispatch = createEventDispatcher();

	store.plugin.subscribe((p) => {
		plugin = p;
		enableFileIcons = plugin.settings.enableFileIcons;
		showTags = plugin.settings.views.list.showTags;
	});

	onMount(() => {
		function handleShowTagsChange() {
			showTags = plugin.settings.views.list.showTags;
		}

		EventManager.getInstance().on(
			PluginEvent.SHOW_TAGS_SETTING_CHANGE,
			handleShowTagsChange,
		);
		return () => {
			EventManager.getInstance().off(
				PluginEvent.SHOW_TAGS_SETTING_CHANGE,
				handleShowTagsChange,
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
			isSmallScreenSize = true;
		} else {
			isSmallScreenSize = false;
		}
	}

	function handleTitleClick() {
		handleItemClick();
	}

	function handleItemClick() {
		openInCurrentTab(plugin, path);
	}

	function handleTitleContextMenu(e: Event) {
		handleItemContextMenu(e);
	}

	function handleFavoriteChange(filePath: string, value: boolean) {
		dispatch("favoritePropertyChange", { filePath, value });
	}

	function handleItemContextMenu(e: Event) {
		const nativeEvent = e as MouseEvent;
		openContextMenu(plugin, path, nativeEvent, {
			isFavorite,
			onFavoriteChange: handleFavoriteChange,
		});
	}

	function handleTitleMouseOver(e: MouseEvent) {
		handleItemMouseOver(e);
	}

	function handleItemMouseOver(e: MouseEvent) {
		const targetEl = e.currentTarget as HTMLElement;
		plugin.app.workspace.trigger("hover-link", {
			event: e,
			linktext: path,
			source: HOVER_LINK_SOURCE_ID,
			targetEl,
			hoverParent: targetEl.parentElement,
		});
	}

	$: tagsClassName = `vault-explorer-list-item__tags ${isSmallScreenSize ? "vault-explorer-list-item__tags--screen-size-sm" : ""}`;
	$: titleClassName = `vault-explorer-list-item__title ${isSmallScreenSize ? "vault-explorer-list-item__title--screen-size-sm" : ""}`;
</script>

<div
	bind:this={ref}
	tabindex="0"
	role="button"
	class="vault-explorer-list-item"
	on:click={handleItemClick}
	on:keydown={(e) => {
		if (e.key === "Enter" || e.key === " ") {
			handleItemClick();
		}
	}}
	on:contextmenu={(e) => {
		e.preventDefault();
		handleItemContextMenu(e);
	}}
	on:focus={() => {}}
	on:mouseover
>
	<Wrap
		spacingX="lg"
		spacingY="sm"
		align="center"
		wrap={isSmallScreenSize ? "wrap" : "nowrap"}
	>
		<div
			tabindex="0"
			role="link"
			class={titleClassName}
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
			<Stack spacing="xs">
				{#if enableFileIcons}
					<Icon iconId={getIconIdForFile(baseName, extension)} />
				{/if}
				<div class="vault-explorer-list-item__title-text">
					{displayName}
				</div>
			</Stack>
		</div>
		{#if showTags}
			<div class={tagsClassName}>
				{#if tags !== null}
					<Wrap
						spacingX="xs"
						spacingY="xs"
						justify={isSmallScreenSize ? "flex-start" : "flex-end"}
					>
						{#each tags as tag}
							<Tag name={tag} variant="unstyled" />
						{/each}
					</Wrap>
				{/if}
			</div>
		{/if}
	</Wrap>
</div>

<style>
	.vault-explorer-list-item {
		padding: 8px;
		border-bottom: 1px solid var(--background-modifier-border);
	}

	.vault-explorer-list-item:hover {
		background-color: var(--background-modifier-hover);
	}

	.vault-explorer-list-item:focus-visible {
		box-shadow: 0 0 0 3px var(--background-modifier-border-focus);
	}

	.vault-explorer-list-item__title {
		width: 50%;
		color: var(--text-accent);
	}

	.vault-explorer-list-item__title:focus-visible {
		box-shadow: 0 0 0 3px var(--background-modifier-border-focus);
	}

	.vault-explorer-list-item__title--screen-size-sm {
		width: 100%;
	}

	.vault-explorer-list-item__title-text {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		cursor: pointer;
	}

	.vault-explorer-list-item__tags {
		width: 50%;
	}

	.vault-explorer-list-item__tags--screen-size-sm {
		width: 100%;
	}
</style>
