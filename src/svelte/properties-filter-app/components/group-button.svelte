<script lang="ts">
	export let name: string;
	export let isSelected: boolean;

	$: className =
		"vault-explorer-group-button" +
		(isSelected ? " vault-explorer-group-button--active" : "");
</script>

<button class={className} on:click>{name}</button>

<style>
	.vault-explorer-group-button {
		all: unset;
		width: calc(100% - 12px);
		padding: 4px 6px;
	}

	.vault-explorer-group-button:hover {
		background-color: var(--background-modifier-hover);
	}

	.vault-explorer-group-button--active {
		background-color: var(--background-modifier-hover);
	}
</style>
