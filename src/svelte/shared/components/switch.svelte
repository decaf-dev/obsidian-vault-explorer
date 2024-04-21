<script lang="ts">
	export let ariaLabel: string | null = null;
	export let value: boolean = false;
	export let id: string | null = null;

	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === "Enter") {
			e.stopPropagation();
			dispatch("change", { value: !value });
		}
	}

	function handleClick(e: MouseEvent) {
		e.stopPropagation();
		dispatch("change", { value: !value });
	}

	let className = "checkbox-container vault-explorer-switch";
	if (value) className += " is-enabled";
</script>

<div
	tabindex="0"
	role="switch"
	aria-checked={value}
	class={className}
	aria-label={ariaLabel}
	on:click={handleClick}
	on:keydown={handleKeyDown}
>
	<input {id} type="checkbox" />
</div>

<style>
	/** This sizes down the original Obsidian switch by 0.75 **/
	.vault-explorer-switch {
		width: calc(var(--toggle-width) * 0.75);
		height: calc(
			(var(--toggle-thumb-height) * 0.75) +
				(var(--toggle-border-width) * 2 * 0.75)
		);
		transition: none !important;
	}

	.vault-explorer-switch:after {
		width: calc(var(--toggle-thumb-width) * 0.75);
		height: calc(var(--toggle-thumb-height) * 0.75);
	}

	.vault-explorer-switch.is-enabled:after {
		transform: translate3d(
			calc(
				(
						var(--toggle-width) - var(--toggle-thumb-width) -
							var(--toggle-border-width)
					) * 0.75
			),
			0,
			0
		);
	}

	.vault-explorer-switch input {
		width: calc(var(--checkbox-size) * 0.75);
		height: calc(var(--checkbox-size) * 0.75);
	}

	.vault-explorer-switch:active:after {
		width: calc(
			(var(--toggle-thumb-width) * 0.75) + (var(--toggle-border-width))
		);
	}

	.vault-explorer-switch:focus-visible {
		outline: 2px solid var(--text-on-accent-inverted);
		outline-offset: 0px;
	}
</style>
