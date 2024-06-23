<script lang="ts">
	import { FileRenderData } from "../types";
	import GridCard from "./grid-card.svelte";

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

<div class="vault-explorer-grid-view">
	<div class="vault-explorer-grid-view__container">
		{#each displayedItems as file (file.path)}
			<GridCard
				name={file.name}
				path={file.path}
				url={file.url}
				tags={file.tags}
				custom1={file.custom1}
				custom2={file.custom2}
				custom3={file.custom3}
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
