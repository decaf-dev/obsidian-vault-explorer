<script lang="ts">
	export let id: string;
	export let label: string;
	export let value: boolean;

	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();

	function handleChange(event: Event) {
		dispatch("change", { nativeEvent: event });
	}
</script>

<div class="vault-explorer-checkbox">
	<label for={id}>{label}</label>
	<input {id} type="checkbox" checked={value} on:change={handleChange} />
</div>

<style>
	.vault-explorer-checkbox {
		display: flex;
		align-items: center;
		column-gap: 0.5rem;
	}
</style>
