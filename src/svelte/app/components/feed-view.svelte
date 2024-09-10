<script lang="ts">
	import PremiumLink from "src/svelte/shared/components/premium-link.svelte";
	import PremiumMessage from "src/svelte/shared/components/premium-message.svelte";
	import { FileRenderData } from "../types";
	import License from "src/svelte/shared/services/license";
	import FeedCard from "./feed-card.svelte";

	export let hasValidLicenseKey = false;
	export let data: FileRenderData[] = [];
	export let startIndex;
	export let pageLength;

	let filteredItems: FileRenderData[] = [];

	License.getInstance()
		.getHasValidKeyStore()
		.subscribe((hasValidKey) => {
			hasValidLicenseKey = hasValidKey;
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
	{#if !hasValidLicenseKey}
		<div>
			<PremiumMessage />
			<PremiumLink />
		</div>
	{/if}
	{#if hasValidLicenseKey}
		{#each filteredItems as fileRenderData (fileRenderData.id)}
			<FeedCard
				displayName={fileRenderData.displayName}
				extension={fileRenderData.extension}
				baseName={fileRenderData.baseName}
				path={fileRenderData.path}
				content={fileRenderData.content}
				createdMillis={fileRenderData.createdMillis}
				on:favoritePropertyChange
			/>
		{/each}
	{/if}
</div>
