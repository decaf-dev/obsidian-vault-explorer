<script lang="ts">
	export let id: string;
	export let name: string;
	export let isSelected: boolean;

	$: className =
		"vault-explorer-group-tag" +
		(isSelected ? " vault-explorer-group-tag--active" : "");

	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();

	function handleClick() {
		dispatch("groupClick", { id });
	}
</script>

<button class={className} on:click={handleClick}>
	{name}
</button>

<style>
	.vault-explorer-group-tag {
		all: unset;
		white-space: nowrap;
		font-size: var(--tag-size);
		font-weight: var(--tag-weight);
		text-decoration: var(--tag-decoration);
		padding: var(--tag-padding-y) var(--tag-padding-x);
		line-height: 1;
		border-radius: var(--tag-radius);

		color: var(--text-faint);
		border: 1px solid var(--background-modifier-border);
		background-color: var(--background-primary);
	}

	.vault-explorer-group-tag--active {
		background-color: var(--tag-background);
		border: 1px solid var(--tag-border-color);
		color: var(--tag-color);
	}
</style>
