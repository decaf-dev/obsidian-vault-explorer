<script lang="ts">
	import { MarkdownView } from "obsidian";
	import VaultExplorerPlugin from "src/main";
	import store from "../../shared/services/store";
	import { HOVER_LINK_SOURCE_ID } from "src/constants";
	import Tag from "src/svelte/shared/components/tag.svelte";
	import Wrap from "src/svelte/shared/components/wrap.svelte";
	import Icon from "src/svelte/shared/components/icon.svelte";
	import Stack from "src/svelte/shared/components/stack.svelte";
	import { getIconIdForFile } from "../services/file-icon";
	import { onMount } from "svelte";
	import EventManager from "src/event/event-manager";
	import { PluginEvent } from "src/event/types";

	export let displayName: string;
	export let baseName: string;
	export let extension: string;
	export let path: string;
	export let tags: string[] | null;

	let enableFileIcons: boolean = false;
	let plugin: VaultExplorerPlugin;

	store.plugin.subscribe((p) => {
		plugin = p;
		enableFileIcons = plugin.settings.enableFileIcons;
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
</script>

<div class="vault-explorer-list-item">
	<Wrap justify="space-between" spacingX="xl" spacingY="sm">
		<div
			tabindex="0"
			role="link"
			class="vault-explorer-list-item__title"
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
			<Stack spacing="xs">
				{#if enableFileIcons}
					<Icon iconId={getIconIdForFile(baseName, extension)} />
				{/if}
				<span>{displayName}</span>
			</Stack>
		</div>
		{#if tags != null}
			<div class="vault-explorer-list-item__tags">
				{#each tags as tag}
					<Tag name={tag} variant="unstyled" />
				{/each}
			</div>
		{/if}
	</Wrap>
</div>

<style>
	.vault-explorer-list-item {
		padding-bottom: 2px;
		border-bottom: 1px solid var(--background-modifier-border);
		margin-bottom: 10px;
	}

	.vault-explorer-list-item__title:focus-visible {
		box-shadow: 0 0 0 3px var(--background-modifier-border-focus);
	}

	.vault-explorer-list-item__title {
		cursor: pointer;
		color: var(--text-accent);
	}

	.vault-explorer-list-item__tags {
		display: flex;
		flex-wrap: wrap;
		row-gap: 5px;
		column-gap: 5px;
	}
</style>
