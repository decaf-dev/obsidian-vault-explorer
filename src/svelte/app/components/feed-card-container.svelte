<script lang="ts">
	import { FileInteractionStyle } from "src/types";
	import { createEventDispatcher } from "svelte";

	export let fileInteractionStyle: FileInteractionStyle;

	const dispatch = createEventDispatcher();
	export let ref: HTMLElement | null = null;

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
		class="vault-explorer-feed-card vault-explorer-feed-card--interactive"
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
	<div bind:this={ref} class="vault-explorer-feed-card">
		<slot />
	</div>
{/if}

<style>
	.vault-explorer-feed-card {
		padding: 8px;
		border-bottom: 1px solid var(--background-modifier-border);
	}

	.vault-explorer-feed-card--interactive:hover {
		background-color: var(--background-modifier-hover);
	}

	.vault-explorer-feed-card--interactive:focus-visible {
		box-shadow: 0 0 0 3px var(--background-modifier-border-focus);
	}
</style>
