<script lang="ts">
	import { FileInteractionStyle, WordBreak } from "src/types";
	import { createEventDispatcher } from "svelte";

	export let fileInteractionStyle: FileInteractionStyle;
	export let wordBreak: WordBreak;

	const dispatch = createEventDispatcher();

	function handleClick() {
		dispatch("click");
	}

	$: className =
		fileInteractionStyle === "content"
			? "vault-explorer-grid-card__title"
			: "vault-explorer-grid-card__title--interactive";
</script>

{#if fileInteractionStyle === "title"}
	<div
		tabindex="0"
		role="link"
		class={className}
		style={`word-break: ${wordBreak};`}
		on:focus={() => {}}
		on:click={(e) => {
			e.preventDefault();
			handleClick();
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
	<div class="vault-explorer-grid-card__title">
		<slot />
	</div>
{/if}

<style>
	.vault-explorer-grid-card__title {
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.vault-explorer-grid-card__title--interactive {
		cursor: pointer;
		color: var(--text-accent);
	}

	.vault-explorer-grid-card__title--interactive:focus-visible {
		box-shadow: 0 0 0 3px var(--background-modifier-border-focus);
	}
</style>
