<script lang="ts">
	import { MarkdownFileRenderData } from "../types";
	import GridCard from "./grid-card.svelte";

	export let data: MarkdownFileRenderData[];
	export let startIndex: number;
	export let pageLength: number;

	let displayedItems: MarkdownFileRenderData[] = [];

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

<div class="vault-explorer-grid-view">
	<div class="vault-explorer-grid-view__container">
		{#each displayedItems as file (file.path)}
			<GridCard
				name={file.name}
				path={file.path}
				url={file.url}
				tags={file.tags}
				source={file.source}
				status={file.status}
			/>
		{/each}
	</div>
</div>

<style>
	.vault-explorer-grid-view__container {
		display: grid;
		row-gap: 2rem;
		column-gap: 2rem;
		grid-template-columns: repeat(auto-fit, minmax(200px, 300px));
	}
</style>
