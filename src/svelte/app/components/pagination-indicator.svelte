<script lang="ts">
	import Stack from "src/svelte/shared/components/stack.svelte";
	import Flex from "src/svelte/shared/components/flex.svelte";
	import IconButton from "src/svelte/shared/components/icon-button.svelte";
	import { createEventDispatcher } from "svelte";

	export let startIndex: number;
	export let endIndex: number;
	export let currentPage: number;
	export let totalPages: number;
	export let totalItems: number;

	const dispatch = createEventDispatcher();
	function handlePageChange(value: number) {
		dispatch("change", {
			value,
		});
	}
</script>

<div class="vault-explorer-pagination-indicator">
	<Stack justify="flex-end" align="center">
		<Stack spacing="xs">
			<Stack spacing="xs">
				<span>{startIndex + 1}</span>
				<span>-</span>
				<span>{endIndex}</span>
			</Stack>
			<span>of</span>
			<span>{totalItems}</span>
		</Stack>
		<Flex>
			<IconButton
				iconId="chevrons-left"
				ariaLabel="First page"
				on:click={() => handlePageChange(1)}
			/>
			<IconButton
				iconId="chevron-left"
				ariaLabel="Previous page"
				disabled={currentPage === 1}
				on:click={() => handlePageChange(currentPage - 1)}
			/>
			<IconButton
				iconId="chevron-right"
				ariaLabel="Next page"
				disabled={currentPage === totalPages}
				on:click={() => handlePageChange(currentPage + 1)}
			/>
			<IconButton
				iconId="chevrons-right"
				ariaLabel="Last page"
				on:click={() => handlePageChange(totalPages)}
			/>
		</Flex>
	</Stack>
</div>

<style>
</style>
