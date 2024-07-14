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

	export let displayName: string;
	export let baseName: string;
	export let extension: string;
	export let path: string;
	export let tags: string[] | null;

	let enableFileIcons: boolean = false;
	let fileInteractionStyle: FileInteractionStyle = "content";
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

	function handleTitleClick() {
		handleItemClick();
	}

	function handleItemClick() {
		openInCurrentTab(plugin, path);
	}

	function handleItemContextMenu(e: CustomEvent) {
		const { nativeEvent } = e.detail;
		openContextMenu(plugin, nativeEvent, path);
	}
</script>

<ListItemContainer
	{fileInteractionStyle}
	on:click={handleItemClick}
	on:contextmenu={handleItemContextMenu}
>
	<Wrap justify="space-between" spacingX="xl" spacingY="sm">
		<ListItemTitle
			{fileInteractionStyle}
			on:click={handleItemClick}
			on:contextmenu={handleItemContextMenu}
		>
			<Stack spacing="xs">
				{#if enableFileIcons}
					<Icon iconId={getIconIdForFile(baseName, extension)} />
				{/if}
				<span>{displayName}</span>
			</Stack>
		</ListItemTitle>
		{#if tags != null}
			<div class="vault-explorer-list-item__tags">
				{#each tags as tag}
					<Tag name={tag} variant="unstyled" />
				{/each}
			</div>
		{/if}
	</Wrap>
</ListItemContainer>

<style>
	.vault-explorer-list-item__tags {
		display: flex;
		flex-wrap: wrap;
		row-gap: 5px;
		column-gap: 5px;
	}
</style>
