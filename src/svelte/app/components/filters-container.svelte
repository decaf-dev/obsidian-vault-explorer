<script lang="ts">
	import VaultExplorerPlugin from "src/main";
	import Stack from "src/svelte/shared/components/stack.svelte";
	import store from "src/svelte/shared/services/store";
	import { onMount } from "svelte";

	let startX: number;
	let startWidth: number;
	let containerRef: HTMLDivElement | null = null;
	let isDragging: boolean = false;

	let plugin: VaultExplorerPlugin;

	store.plugin.subscribe((p) => {
		plugin = p;
	});

	onMount(() => {
		if (containerRef != null)
			containerRef.style.maxWidth = plugin.settings.filtersWidth + "px";
	});

	function onMouseDown(event: MouseEvent) {
		if (!containerRef) return;

		startX = event.clientX;
		startWidth = plugin.settings.filtersWidth;

		// startWidth = parseInt(window.getComputedStyle(containerRef).width, 10);

		document.documentElement.addEventListener("mousemove", onMouseMove);
		document.documentElement.addEventListener("mouseup", onMouseUp);

		// Prevent pointer events on draggable elements
		containerRef.style.pointerEvents = "none";
		isDragging = true;
	}

	function onMouseMove(event: MouseEvent) {
		if (!containerRef) return;
		containerRef.style.maxWidth =
			startWidth + event.clientX - startX + "px";
	}

	async function onMouseUp() {
		document.documentElement.removeEventListener("mousemove", onMouseMove);
		document.documentElement.removeEventListener("mouseup", onMouseUp);

		if (containerRef) {
			// Re-enable pointer events on draggable elements
			containerRef.style.pointerEvents = "auto";
			isDragging = false;
			plugin.settings.filtersWidth = parseInt(
				containerRef.style.maxWidth.replace("px", ""),
			);
			await plugin.saveSettings();
		}
	}

	$: className = isDragging
		? "vault-explorer-resize-handle vault-explorer-resize-handle--dragging"
		: "vault-explorer-resize-handle";
</script>

<div class="vault-explorer-filters" bind:this={containerRef}>
	<Stack direction="column" spacing="sm">
		<slot />
	</Stack>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class={className} on:mousedown={onMouseDown}></div>
</div>

<style>
	.vault-explorer-filters {
		width: 100%;
		position: relative;
	}

	.vault-explorer-resize-handle {
		position: absolute;
		z-index: 1;
		height: 100%;
		top: 0;
		right: 0;
		width: 3px;
		border-right: var(--divider-width) solid var(--divider-color);
		cursor: col-resize;
		transition: border-color 200ms ease-in-out;
	}

	.vault-explorer-resize-handle:hover {
		background-color: var(--divider-color-hover);
		border-color: var(--divider-color-hover);
	}

	.vault-explorer-resize-handle.vault-explorer-resize-handle--dragging {
		background-color: var(--divider-color-hover);
		border-color: var(--divider-color-hover);
		height: 100%;
	}
</style>
