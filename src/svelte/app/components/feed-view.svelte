<script lang="ts">
	import PremiumLink from "src/svelte/shared/components/premium-link.svelte";
	import PremiumMessage from "src/svelte/shared/components/premium-message.svelte";
	import { FileRenderData } from "../types";
	import License from "src/svelte/shared/services/license";
	import FeedCard from "./feed-card.svelte";
	import { onMount } from "svelte";
	import EventManager from "src/event/event-manager";
	import VaultExplorerPlugin from "src/main";
	import store from "src/svelte/shared/services/store";

	export let enablePremiumFeatures = false;
	export let data: FileRenderData[] = [];
	export let startIndex;
	export let pageLength;

	let enableFileIcons = false;
	let displayedItems: FileRenderData[] = [];

	License.getInstance()
		.getIsDeviceRegisteredStore()
		.subscribe((isRegistered) => {
			enablePremiumFeatures = isRegistered;
		});

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
	//TODO replace file.path with a unique id that is generated when the
	//file is added
</script>

<div class="vault-explorer-feed-view">
	{#if !enablePremiumFeatures}
		<div>
			<PremiumMessage />
			<PremiumLink />
		</div>
	{/if}
	{#if enablePremiumFeatures}
		{#each displayedItems as fileData (fileData.path)}
			<FeedCard
				displayName={fileData.displayName}
				extension={fileData.extension}
				baseName={fileData.baseName}
				path={fileData.path}
				tags={fileData.tags}
				content={fileData.content}
				createdMillis={fileData.createdMillis}
			/>
		{/each}
	{/if}
</div>
