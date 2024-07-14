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

	$: className = `vault-explorer-feed-card__title ${fileInteractionStyle === "content" ? "" : "vault-explorer-feed-card__title--interactive"}`;
</script>

{#if fileInteractionStyle === "title"}
	<div
		tabindex="0"
		role="link"
		class={className}
		on:focus={() => {}}
		on:click={(e) => {
			e.preventDefault();
			handleClick();
		}}
		on:contextmenu={(e) => {
			e.preventDefault();
			handleContextMenu(e);
		}}
		on:keydown={(e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				handleClick();
			}
		}}
		on:mouseover
	>
		<slot />
	</div>
{/if}

{#if fileInteractionStyle === "content"}
	<div class={className}>
		<slot />
	</div>
{/if}

<style>
	.vault-explorer-feed-card__title {
		width: 100%;
	}

	.vault-explorer-feed-card__title--interactive {
		cursor: pointer;
		color: var(--text-accent);
	}

	.vault-explorer-feed-card__title--interactive:focus-visible {
		box-shadow: 0 0 0 3px var(--background-modifier-border-focus);
	}
</style>
