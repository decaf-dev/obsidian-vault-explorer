<script lang="ts">
	import { FileInteractionStyle } from "src/types";
	import { createEventDispatcher } from "svelte";

	export let fileInteractionStyle: FileInteractionStyle;
	export let ref: HTMLElement | null = null;

	const dispatch = createEventDispatcher();

	function handleClick() {
		dispatch("click");
	}

	function handleContextMenu(e: MouseEvent) {
		dispatch("contextmenu", { nativeEvent: e });
	}
</script>

{#if fileInteractionStyle === "content"}
	<div
		bind:this={ref}
		tabindex="0"
		role="button"
		class="vault-explorer-list-item vault-explorer-list-item--interactive"
		on:click={handleClick}
		on:keydown={(e) => {
			if (e.key === "Enter" || e.key === " ") {
				handleClick();
			}
		}}
		on:contextmenu={(e) => {
			e.preventDefault();
			handleContextMenu(e);
		}}
		on:focus={() => {}}
		on:mouseover
	>
		<slot />
	</div>
{/if}

{#if fileInteractionStyle === "title"}
	<div bind:this={ref} class="vault-explorer-list-item">
		<slot />
	</div>
{/if}

<style>
	.vault-explorer-list-item {
		padding: 8px;
		border-bottom: 1px solid var(--background-modifier-border);
	}

	.vault-explorer-list-item--interactive:focus-visible {
		box-shadow: 0 0 0 3px var(--background-modifier-border-focus);
	}

	.vault-explorer-list-item--interactive:hover {
		background-color: var(--background-modifier-hover);
	}
</style>
