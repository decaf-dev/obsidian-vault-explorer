<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";
	import { openContextMenu } from "../services/context-menu";
	import { formatAsBearTimeString } from "../services/time-string";
	import { FileRenderData } from "../types";
	import store from "src/svelte/shared/services/store";
	import VaultExplorerPlugin from "src/main";
	import Tag from "src/svelte/shared/components/tag.svelte";
	import Wrap from "src/svelte/shared/components/wrap.svelte";
	import { openInCurrentTab } from "../services/open-file";
	import { HOVER_LINK_SOURCE_ID } from "src/constants";
	import Stack from "src/svelte/shared/components/stack.svelte";
	import { getIconIdForFile } from "../services/file-icon";
	import Icon from "src/svelte/shared/components/icon.svelte";
	import EventManager from "src/event/event-manager";
	import { PluginEvent } from "src/event/types";

	interface TColumn {
		key: string;
		label: string;
		classNames?: string;
		format?: (value: unknown) => string;
	}

	export let data: FileRenderData[];
	export let startIndex: number;
	export let pageLength: number;

	let filteredItems: FileRenderData[] = [];
	let plugin: VaultExplorerPlugin | null = null;
	let enableFileIcons: boolean = true;

	let columns: TColumn[] = [
		{
			key: "baseName",
			label: "Name",
			classNames: "vault-explorer-table-view__title-text",
		},
		{ key: "extension", label: "Extension" },
		{ key: "basePath", label: "Folder" },
		{
			key: "tags",
			label: "Tags",
		},
		{
			key: "isFavorite",
			label: "Favorite",
			format: (value: unknown) => (value === true ? "Yes" : "No"),
		},
		{
			key: "createdMillis",
			label: "Created",
			format: (value: unknown) => formatAsBearTimeString(value as number),
		},
		{
			key: "modifiedMillis",
			label: "Modified",
			format: (value: unknown) => formatAsBearTimeString(value as number),
		},
	];

	const dispatch = createEventDispatcher();

	store.plugin.subscribe((p) => {
		plugin = p;
		enableFileIcons = plugin.settings.enableFileIcons;
	});

	onMount(() => {
		function handleFileIconsChange() {
			if (plugin === null) return;

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

	function handleFavoriteChange(filePath: string, value: boolean) {
		dispatch("favoritePropertyChange", { filePath, value });
	}

	function handleRowClick(path: string) {
		if (plugin === null) return;

		openInCurrentTab(plugin, path);
	}

	function handleRowMouseOver(e: MouseEvent, path: string) {
		if (plugin === null) return;

		const targetEl = e.currentTarget as HTMLElement;
		plugin.app.workspace.trigger("hover-link", {
			event: e,
			linktext: path,
			source: HOVER_LINK_SOURCE_ID,
			targetEl,
			hoverParent: targetEl.parentElement,
		});
	}

	function handleRowContextMenu(
		e: Event,
		path: string,
		isFavorite: boolean | null,
	) {
		if (plugin === null) return;

		const nativeEvent = e as MouseEvent;
		openContextMenu(plugin, path, nativeEvent, {
			isFavorite,
			onFavoriteChange: handleFavoriteChange,
		});
	}

	function getValue(item: FileRenderData, column: TColumn): unknown {
		const { key, format } = column;
		const itemValue = item[key as keyof FileRenderData] ?? "";

		if (format !== undefined) {
			return format(itemValue);
		}
		return itemValue;
	}

	function asStringArray(value: unknown): string[] {
		return value as string[];
	}

	$: {
		if (startIndex < data.length) {
			filteredItems = Array.from({ length: pageLength }, (_, i) => {
				const index = startIndex + i;
				return data[index];
			});
		} else {
			filteredItems = [];
		}
	}
</script>

<div class="vault-explorer-table-view">
	<table>
		<thead>
			<tr>
				{#each columns as column (column.key)}
					<th>{column.label}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each filteredItems as filteredItem}
				<tr
					tabindex="0"
					role="button"
					class="vault-explorer-list-item"
					on:click={() => handleRowClick(filteredItem.path)}
					on:keydown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							handleRowClick(filteredItem.path);
						}
					}}
					on:focus={() => {}}
					on:contextmenu={(e) =>
						handleRowContextMenu(
							e,
							filteredItem.path,
							filteredItem.isFavorite,
						)}
					on:mouseover={(e) =>
						handleRowMouseOver(e, filteredItem.path)}
				>
					{#each columns as column (column.key)}
						{@const value = getValue(filteredItem, column)}
						<td>
							{#if column.key == "tags"}
								<Wrap spacingX="sm" spacingY="sm">
									{#each asStringArray(value) as tag}
										<Tag name={tag} variant="unstyled" />
									{/each}
								</Wrap>
							{:else if column.key == "baseName"}
								<div class="vault-explorer-table-view__title">
									<Stack spacing="xs">
										{#if enableFileIcons}
											<Icon
												iconId={getIconIdForFile(
													filteredItem.baseName,
													filteredItem.extension,
												)}
											/>
										{/if}
										<div
											class="vault-explorer-table-view__title-text"
										>
											{value}
										</div>
									</Stack>
								</div>
							{:else}
								<div>{value}</div>
							{/if}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.vault-explorer-table-view {
		width: 100%;
		overflow-x: auto;
	}

	.vault-explorer-table-view table {
		border-collapse: collapse;
	}

	.vault-explorer-table-view th:first-child,
	.vault-explorer-table-view td:first-child {
		width: 300px;
		max-width: 300px;
		overflow: hidden;
	}

	.vault-explorer-table-view__title {
		width: 100%;
	}

	.vault-explorer-table-view__title-text {
		color: var(--text-accent);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		cursor: pointer;
	}

	.vault-explorer-table-view th {
		text-align: left;
	}

	.vault-explorer-table-view th,
	.vault-explorer-table-view td {
		border: 1px solid var(--background-modifier-border);
		padding: 8px;
	}

	.vault-explorer-table-view th:nth-child(4) {
		min-width: 250px;
	}

	.vault-explorer-table-view th:nth-child(6) {
		min-width: 175px;
	}

	.vault-explorer-table-view th:nth-child(7) {
		min-width: 175px;
	}

	.vault-explorer-table-view tr:hover:not(:has(th)) {
		background-color: var(--background-modifier-hover);
	}

	.vault-explorer-table-view tr:focus-visible:not(:has(th)) {
		box-shadow: 0 0 0 3px var(--background-modifier-border-focus);
	}
</style>
