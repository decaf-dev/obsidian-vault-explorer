<script lang="ts">
	import { FileInteractionStyle, WordBreak } from "src/types";
	import { createEventDispatcher } from "svelte";

	export let fileInteractionStyle: FileInteractionStyle;

	const dispatch = createEventDispatcher();

	function handleClick() {
		dispatch("click");
	}

	function handleContextMenu(e: MouseEvent) {
		dispatch("contextmenu", { nativeEvent: e });
	}

	$: className =
		fileInteractionStyle === "content"
			? "vault-explorer-list-item__title"
			: "vault-explorer-list-item__title--interactive";
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
	<div class="vault-explorer-list-item__title">
		<slot />
	</div>
{/if}

<style>
	.vault-explorer-list-item__title {
		overflow: hidden;
		text-overflow: ellipsis;
		/* font-weight: var(--font-medium); */
	}

	.vault-explorer-list-item__title--interactive {
		cursor: pointer;
		color: var(--text-accent);
	}

	.vault-explorer-list-item__title--interactive:focus-visible {
		box-shadow: 0 0 0 3px var(--background-modifier-border-focus);
	}
</style>
