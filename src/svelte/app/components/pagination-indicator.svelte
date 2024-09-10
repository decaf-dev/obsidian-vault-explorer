<script lang="ts">
	import Stack from "src/svelte/shared/components/stack.svelte";
	import Flex from "src/svelte/shared/components/flex.svelte";
	import IconButton from "src/svelte/shared/components/icon-button.svelte";
	import { createEventDispatcher, onMount } from "svelte";

	export let startIndex: number;
	export let endIndex: number;
	export let currentPage: number;
	export let totalPages: number;
	export let totalItems: number;

	let isWrapped = false;
	let ref: HTMLElement | null = null;

	function checkWrapping() {
		const parentEl = ref?.parentElement;
		if (parentEl && ref) {
			if (ref.offsetWidth == parentEl.offsetWidth) {
				isWrapped = true;
			} else {
				isWrapped = false;
			}
		}
	}

	onMount(() => {
		let resizeObserver: ResizeObserver;

		const leafEl = ref?.closest(
			".workspace-leaf-content",
		) as HTMLElement | null;
		if (leafEl) {
			checkWrapping();

			resizeObserver = new ResizeObserver(() => {
				checkWrapping();
			});
			resizeObserver.observe(leafEl);
		}

		return () => {
			resizeObserver?.disconnect();
		};
	});

	const dispatch = createEventDispatcher();
	function handlePageChange(value: number) {
		dispatch("change", {
			value,
		});
	}
</script>

<div class="vault-explorer-pagination-indicator" bind:this={ref}>
	<div class="vault-explorer-pagination-indicator__container">
		<Stack
			align="center"
			direction={isWrapped ? "row-reverse" : "row"}
			justify="flex-end"
			spacing="md"
		>
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
			<Stack spacing="xs">
				<Stack spacing="xs">
					<span>{startIndex + 1}</span>
					<span>-</span>
					<span>{endIndex}</span>
				</Stack>
				<span>of</span>
				<span>{totalItems}</span>
			</Stack>
		</Stack>
	</div>
</div>

<style>
	.vault-explorer-pagination-indicator__container {
		flex: 1;
		position: fixed;
		bottom: 0px;
		right: 0px;
		display: flex;
		border-style: solid;
		border-width: var(--status-bar-border-width);
		border-color: var(--status-bar-border-color);
		background-color: var(--status-bar-background);
		color: var(--status-bar-text-color);
		font-size: var(--status-bar-font-size);
		padding: var(--size-4-1);
	}

	.vault-explorer-pagination-indicator {
		display: relative;
	}
</style>
