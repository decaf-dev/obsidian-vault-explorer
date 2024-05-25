<script lang="ts">
	import Flex from "src/svelte/shared/components/flex.svelte";
	import Icon from "src/svelte/shared/components/icon.svelte";

	export let id: string;
	export let name: string;
	export let isSelected: boolean;

	let ref: HTMLElement;

	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();

	function handleClick() {
		dispatch("itemClick", { id });
	}

	function handleMouseDown(event: Event) {
		ref.setAttribute("draggable", "true");
		Object.defineProperty(event, "target", {
			value: ref,
		});
		ref.dispatchEvent(new Event(event.type, event));
	}

	function handleDragStart(event: Event) {
		dispatch("itemDragStart", { nativeEvent: event, id });
	}

	function handleDragOver(event: Event) {
		dispatch("itemDragOver", { nativeEvent: event, id });
	}

	function handleDrop(event: Event) {
		dispatch("itemDrop", { nativeEvent: event, id });
	}

	function handleDragEnd(event: Event) {
		dispatch("itemDragEnd", { nativeEvent: event, id });
	}

	$: className =
		"vault-explorer-group-item" +
		(isSelected ? " vault-explorer-group-item--active" : "");
</script>

<div
	role="listitem"
	bind:this={ref}
	on:dragstart={handleDragStart}
	on:dragover={handleDragOver}
	on:drop={handleDrop}
	on:dragend={handleDragEnd}
>
	<Flex align="center">
		<div
			tabindex="0"
			role="button"
			class="vault-explorer-group-item__icon"
			on:mousedown={handleMouseDown}
		>
			<Icon iconId="grip-vertical" />
		</div>
		<div
			tabindex="0"
			role="button"
			class={className}
			on:click={handleClick}
			on:keydown={(e) =>
				(e.key === "Enter" || e.key === " ") && handleClick()}
		>
			{name}
		</div>
	</Flex>
</div>

<style>
	.vault-explorer-group-item__icon {
		margin-top: 4px;
	}

	.vault-explorer-group-item {
		display: flex;
		width: calc(100% - 12px);
		padding: 4px 6px;
	}

	.vault-explorer-group-item:hover {
		background-color: var(--background-modifier-hover);
	}

	.vault-explorer-group-button--active {
		background-color: var(--background-modifier-hover);
	}
</style>
