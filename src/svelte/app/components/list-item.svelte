<script lang="ts">
	import VaultExplorerPlugin from "src/main";
	import store from "../../shared/services/store";
	import Tag from "src/svelte/shared/components/tag.svelte";
	import Wrap from "src/svelte/shared/components/wrap.svelte";
	import Icon from "src/svelte/shared/components/icon.svelte";
	import Stack from "src/svelte/shared/components/stack.svelte";
	import { getIconIdForFile } from "../services/file-icon";
	import { onMount } from "svelte";
	import EventManager from "src/event/event-manager";
	import { PluginEvent } from "src/event/types";
	import ListItemContainer from "./list-item-container.svelte";
	import { FileInteractionStyle } from "src/types";
	import { openContextMenu } from "../services/context-menu";
	import { openInCurrentTab } from "../services/open-file";
	import ListItemTitle from "./list-item-title.svelte";
	import { HOVER_LINK_SOURCE_ID } from "src/constants";
	import { SCREEN_SIZE_MD } from "../constants";

	export let displayName: string;
	export let baseName: string;
	export let extension: string;
	export let path: string;
	export let tags: string[] | null;

	let enableFileIcons: boolean = false;
	let fileInteractionStyle: FileInteractionStyle = "content";
	let isSmallScreenSize: boolean = false;
	let ref: HTMLElement | null = null;
	let plugin: VaultExplorerPlugin;

	store.plugin.subscribe((p) => {
		plugin = p;
		enableFileIcons = plugin.settings.enableFileIcons;
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

	function handleTitleContextMenu(e: CustomEvent) {
		handleItemContextMenu(e);
	}

	function handleItemContextMenu(e: CustomEvent) {
		const { nativeEvent } = e.detail;
		openContextMenu(plugin, nativeEvent, path);
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
</script>

<ListItemContainer
	{fileInteractionStyle}
	bind:ref
	on:click={handleItemClick}
	on:contextmenu={handleItemContextMenu}
>
	<Wrap
		spacingX="lg"
		spacingY="sm"
		align="center"
		wrap={isSmallScreenSize ? "wrap" : "nowrap"}
	>
		<ListItemTitle
			{isSmallScreenSize}
			{fileInteractionStyle}
			on:click={handleTitleClick}
			on:contextmenu={handleTitleContextMenu}
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
		</ListItemTitle>
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
	</Wrap>
</ListItemContainer>

<style>
	.vault-explorer-list-item__title-text {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.vault-explorer-list-item__tags {
		width: 50%;
	}

	.vault-explorer-list-item__tags--screen-size-sm {
		width: 100%;
	}
</style>
