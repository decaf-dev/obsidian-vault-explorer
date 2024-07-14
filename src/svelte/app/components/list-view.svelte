<script lang="ts">
	import ListItem from "./list-item.svelte";

	import { FileRenderData } from "../types";

	export let data: FileRenderData[];
	export let startIndex: number;
	export let pageLength: number;

	let filteredItems: FileRenderData[] = [];

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

<div class="vault-explorer-list-view">
	{#each filteredItems as fileRenderData (fileRenderData.id)}
		<ListItem
			displayName={fileRenderData.displayName}
			extension={fileRenderData.extension}
			baseName={fileRenderData.baseName}
			path={fileRenderData.path}
			tags={fileRenderData.tags}
		/>
	{/each}
</div>
