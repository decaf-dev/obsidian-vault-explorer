<script lang="ts">
	import IconButton from "src/svelte/shared/components/icon-button.svelte";
	import Stack from "src/svelte/shared/components/stack.svelte";
	import { createEventDispatcher } from "svelte";

	export let value: string;

	let inputRef: HTMLInputElement | null;
	let hidden: boolean = true;

	const dispatch = createEventDispatcher();

	function handleClearClick() {
		dispatch("clear", { value: "" });
	}

	function handleIconClick() {
		hidden = !hidden;
		if (!hidden) {
			requestAnimationFrame(() => {
				inputRef?.focus();
			});
		}
	}
</script>

<Stack spacing="sm">
	<div
		class="vault-explorer-search-filter"
		style="display: {hidden ? 'none' : 'block'};"
	>
		<input
			bind:this={inputRef}
			type="text"
			placeholder="Search..."
			{value}
			on:input
		/>
		{#if value.length > 0}
			<div
				tabindex="0"
				role="button"
				aria-label="Clear search"
				class="search-input-clear-button"
				on:click={() => handleClearClick()}
				on:keydown={(e) => {
					if (e.key === "Enter") {
						handleClearClick();
					}
				}}
			/>
		{/if}
	</div>
	<IconButton
		iconId="search"
		ariaLabel="Search"
		on:click={() => handleIconClick()}
	/>
</Stack>

<style>
	.vault-explorer-search-filter input[type="text"] {
		width: 100%;
		height: 24px;
	}

	.vault-explorer-search-filter {
		position: relative;
		width: 100%;
		max-width: 300px;
	}
</style>
