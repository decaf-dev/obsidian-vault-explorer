<script lang="ts">
	import ListItem from "./list-item.svelte";

	import { MarkdownFileRenderData } from "../types";

	export let data: MarkdownFileRenderData[];
	export let currentPage: number;
	export let pageSize: number;

	// Calculate the items to display based on the current page
	$: displayedItems = Array.from({ length: pageSize }, (_, i) => ({
		id: (currentPage - 1) * pageSize + i + 1,
		...data[(currentPage - 1) * pageSize + i],
	}));
</script>

<div class="vault-explorer-list-view">
	{#each displayedItems as file (file.id)}
		<ListItem name={file.name} path={file.path} />
	{/each}
</div>
