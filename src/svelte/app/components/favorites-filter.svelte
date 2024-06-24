<script lang="ts">
	import Checkbox from "src/svelte/shared/components/checkbox.svelte";

	export let value: boolean;
</script>

<Checkbox id="favorites" label="Favorites" {value} on:change />
