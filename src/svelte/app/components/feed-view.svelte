<script lang="ts">
	import PremiumLink from "src/svelte/shared/components/premium-link.svelte";
	import PremiumMessage from "src/svelte/shared/components/premium-message.svelte";
	import { FileRenderData } from "../types";
	import License from "src/svelte/shared/services/license";
	import FeedCard from "./feed-card.svelte";

	export let isDeviceRegistered = false;
	export let data: FileRenderData[] = [];
	export let startIndex;
	export let pageLength;

	let filteredItems: FileRenderData[] = [];

	License.getInstance()
		.getIsDeviceRegisteredStore()
		.subscribe((isRegistered) => {
			isDeviceRegistered = isRegistered;
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
</script>

<div class="vault-explorer-feed-view">
	{#if !isDeviceRegistered}
		<div>
			<PremiumMessage />
			<PremiumLink />
		</div>
	{/if}
	{#if isDeviceRegistered}
		{#each filteredItems as fileRenderData (fileRenderData.id)}
			<FeedCard
				displayName={fileRenderData.displayName}
				extension={fileRenderData.extension}
				baseName={fileRenderData.baseName}
				path={fileRenderData.path}
				tags={fileRenderData.tags}
				content={fileRenderData.content}
				createdMillis={fileRenderData.createdMillis}
				isFavorite={fileRenderData.isFavorite}
				on:favoritePropertyChange
			/>
		{/each}
	{/if}
</div>
