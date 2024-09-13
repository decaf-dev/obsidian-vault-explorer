<script lang="ts">
	import { FileRenderData } from "../types";
	import GridCard from "./grid-card.svelte";

	export let data: FileRenderData[];
	export let startIndex: number;
	export let pageLength: number;
	export let enablePremiumFeatures: boolean;

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

<div class="vault-explorer-grid-view">
	<div class="vault-explorer-grid-view__container">
		{#each filteredItems as fileRenderData (fileRenderData.id)}
			<GridCard
				{enablePremiumFeatures}
				displayName={fileRenderData.displayName}
				path={fileRenderData.path}
				coverImageFit={fileRenderData.coverImageFit}
				baseName={fileRenderData.baseName}
				extension={fileRenderData.extension}
				imageUrl={fileRenderData.imageUrl}
				url={fileRenderData.url}
				tags={fileRenderData.tags}
				custom1={fileRenderData.custom1}
				custom2={fileRenderData.custom2}
				custom3={fileRenderData.custom3}
				on:coverImageFitChange
			/>
		{/each}
	</div>
</div>

<style>
	.vault-explorer-grid-view__container {
		display: flex;
		flex-wrap: wrap;
		row-gap: 2rem;
		column-gap: 2rem;
		/* grid-template-columns: repeat(auto-fit, minmax(200px, 300px)); */
	}
</style>
