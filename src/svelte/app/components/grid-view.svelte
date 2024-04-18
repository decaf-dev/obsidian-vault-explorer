<script lang="ts">
	import { MarkdownFileRenderData } from "../types";
	import GridCard from "./grid-card.svelte";

	export let data: MarkdownFileRenderData[];
</script>

<div class="vault-explorer-grid-view">
	{#each data as file}
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

<style>
	.vault-explorer-grid-view {
		display: grid;
		row-gap: 2rem;
		column-gap: 2rem;
		grid-template-columns: repeat(auto-fit, minmax(200px, 300px));
	}
</style>
