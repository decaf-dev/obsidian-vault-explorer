<script lang="ts">
	import ListItem from "./list-item.svelte";

	import { FileRenderData } from "../types";

	export let data: FileRenderData[];
	export let startIndex: number;
	export let pageLength: number;

	let displayedItems: FileRenderData[] = [];

	$: {
		if (startIndex < data.length) {
			displayedItems = Array.from({ length: pageLength }, (_, i) => {
				const index = startIndex + i;
				return data[index];
			});
		} else {
			displayedItems = [];
		}
	}
	//TODO replace file.path with a unique id that is generated when the file is added
</script>

<div class="vault-explorer-list-view">
	{#each displayedItems as file (file.path)}
		<ListItem name={file.name} path={file.path} tags={file.tags} />
	{/each}
</div>
