<script lang="ts">
	import { FileInteractionStyle } from "src/types";
	import { createEventDispatcher } from "svelte";

	export let fileInteractionStyle: FileInteractionStyle;

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
		tabindex="0"
		role="button"
		class="vault-explorer-grid-card vault-explorer-grid-card--interactive"
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
	>
		<slot />
	</div>
{/if}

{#if fileInteractionStyle === "title"}
	<div class="vault-explorer-grid-card">
		<slot />
	</div>
{/if}

<style>
	.vault-explorer-grid-card {
		width: 100%;
		max-width: 425px;
		/* height: max-content; */
		box-shadow: var(--shadow-s);
		border-top-left-radius: var(--radius-m);
		border-top-right-radius: var(--radius-m);
	}

	.vault-explorer-grid-card--interactive:hover {
		background-color: var(--background-modifier-hover);
	}

	.vault-explorer-grid-card--interactive:focus-visible {
		box-shadow: 0 0 0 3px var(--background-modifier-border-focus);
	}
</style>
