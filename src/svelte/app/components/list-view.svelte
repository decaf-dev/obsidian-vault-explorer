<script lang="ts">
	import ListItem from "./list-item.svelte";

	import { MarkdownFileRenderData } from "../types";

	export let data: MarkdownFileRenderData[];
</script>

<div class="vault-explorer-list-view">
	{#each data as file}
		<ListItem name={file.name} path={file.path} />
	{/each}
</div>
