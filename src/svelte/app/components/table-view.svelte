<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { openContextMenu } from "../services/context-menu";
	import { formatAsBearTimeString } from "../services/time-string";
	import { FileRenderData } from "../types";
	import store from "src/svelte/shared/services/store";
	import VaultExplorerPlugin from "src/main";

	export let data: FileRenderData[];
	export let startIndex: number;
	export let pageLength: number;

	let filteredItems: FileRenderData[] = [];
	let plugin: VaultExplorerPlugin | null = null;

	const dispatch = createEventDispatcher();

	store.plugin.subscribe((p) => {
		plugin = p;
	});

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

	function handleFavoriteChange(filePath: string, value: boolean) {
		dispatch("favoritePropertyChange", { filePath, value });
	}

	function handleRowContextMenu(
		e: Event,
		path: string,
		isFavorite: boolean | null,
	) {
		if (plugin === null) {
			return;
		}

		const nativeEvent = e as MouseEvent;
		openContextMenu(plugin, path, nativeEvent, {
			isFavorite,
			onFavoriteChange: handleFavoriteChange,
		});
	}

	interface TColumn {
		key: string;
		label: string;
		format?: (value: unknown) => string;
	}

	let columns: TColumn[] = [
		{ key: "baseName", label: "Name" },
		{ key: "extension", label: "Extension" },
		{ key: "basePath", label: "Path" },
		{ key: "tags", label: "Tags" },
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

	function getValue(item: FileRenderData, column: TColumn): any {
		const { key, format } = column;
		const itemValue = item[key as keyof FileRenderData] ?? "";
		// console.log(itemValue);
		if (format !== undefined) {
			return format(itemValue);
		}
		return itemValue;
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
					on:contextmenu={(e) =>
						handleRowContextMenu(
							e,
							filteredItem.path,
							filteredItem.isFavorite,
						)}
				>
					{#each columns as column (column.key)}
						<td>{getValue(filteredItem, column)}</td>
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

	.vault-explorer-table-view th {
		text-align: left;
	}

	.vault-explorer-table-view th,
	.vault-explorer-table-view td {
		border: 1px solid var(--background-modifier-border);
		padding: 8px;
	}

	.vault-explorer-table-view tr:hover:not(:has(th)) {
		background-color: var(--background-modifier-hover);
	}
</style>
