<script lang="ts">
	import { MarkdownFileRenderData } from "../types";
	import GridCard from "./grid-card.svelte";

	export let data: MarkdownFileRenderData[];
	export let currentPage: number;
	export let pageSize: number;

	// Calculate the items to display based on the current page
	$: displayedItems = Array.from({ length: pageSize }, (_, i) => ({
		id: (currentPage - 1) * pageSize + i + 1,
		...data[(currentPage - 1) * pageSize + i],
	}));
</script>

<div class="vault-explorer-grid-view">
	<div class="vault-explorer-grid-view__container">
		{#each displayedItems as file (file.id)}
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
