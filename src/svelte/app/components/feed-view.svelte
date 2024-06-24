<script lang="ts">
	import PremiumLink from "src/svelte/shared/components/premium-link.svelte";
	import PremiumMessage from "src/svelte/shared/components/premium-message.svelte";
	import { FileRenderData } from "../types";
	import License from "src/svelte/shared/services/license";
	import FeedCard from "./feed-card.svelte";

	export let enablePremiumFeatures = false;
	export let data: FileRenderData[] = [];

	License.getInstance()
		.getIsDeviceRegisteredStore()
		.subscribe((isRegistered) => {
			enablePremiumFeatures = isRegistered;
		});
</script>

<div class="vault-explorer-feed-view">
	{#if !enablePremiumFeatures}
		<div>
			<PremiumMessage />
			<PremiumLink />
		</div>
	{/if}
	{#if enablePremiumFeatures}
		{#each data as fileData}
			<FeedCard
				name={fileData.name}
				path={fileData.path}
				url={fileData.url}
				tags={fileData.tags}
				content={fileData.content}
				createdMillis={fileData.createdMillis}
			/>
		{/each}
	{/if}
</div>
