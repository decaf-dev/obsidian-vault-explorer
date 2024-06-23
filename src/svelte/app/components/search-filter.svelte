<script lang="ts">
	import { createEventDispatcher } from "svelte";

	export let value: string;

	const dispatch = createEventDispatcher();

	function handleClearClick() {
		dispatch("clear", { value: "" });
	}
</script>

<div class="vault-explorer-search-container">
	<input type="text" placeholder="Search..." {value} on:input />
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

<style>
	.vault-explorer input[type="text"] {
		width: 100%;
	}

	.vault-explorer-search-container {
		position: relative;
		width: 100%;
		max-width: 300px;
	}
</style>
