<script lang="ts">
	import { FileRenderData } from "../types";
	import FeedCard from "./feed-card.svelte";

	export let data: FileRenderData[] = [];
	export let startIndex;
	export let pageLength;
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

<div class="vault-explorer-feed-view">
	{#each filteredItems as fileRenderData (fileRenderData.id)}
		<FeedCard
			{enablePremiumFeatures}
			displayName={fileRenderData.displayName}
			extension={fileRenderData.extension}
			baseName={fileRenderData.baseName}
			path={fileRenderData.path}
			content={fileRenderData.content}
			createdMillis={fileRenderData.createdMillis}
		/>
	{/each}
</div>
