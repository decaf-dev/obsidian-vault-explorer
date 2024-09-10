<script lang="ts">
	import { onMount } from "svelte";
	import Icon from "./icon.svelte";

	export let width = "fit-content";
	export let options: string[] = [];

	let inputValue = "";
	let selectedValue = "";
	let showDropdown = false;

	onMount(() => {
		document.addEventListener("click", handleClickOutside);

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	});

	function handleOptionClick(e: Event, option: string) {
		e.stopPropagation();
		inputValue = option;
		selectedValue = option;
		showDropdown = false;
	}

	function handleInputChange(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		inputValue = value;
	}

	function handleInputClick() {
		showDropdown = true;
		inputValue = "";
	}

	function handleClickOutside(e: Event) {
		const targetEl = e.target as HTMLElement;
		const isInsideClick = targetEl.closest(
			".vault-explorer-search-selection",
		);
		if (!isInsideClick && showDropdown) {
			showDropdown = false;
			inputValue = "";
		}
	}

	function fuzzySearch(input: string) {
		return options.filter((option) =>
			option.toLowerCase().includes(input.toLowerCase()),
		);
	}

	$: filteredOptions = fuzzySearch(inputValue);
</script>

<div class="vault-explorer-search-selection" style={`width: ${width}`}>
	<input
		bind:value={inputValue}
		placeholder={selectedValue || "Search..."}
		type="text"
		on:input={handleInputChange}
		on:click={handleInputClick}
	/>
	<span class="vault-explorer-dropdown-icon"
		><Icon iconId="chevron-down" size="xs" /></span
	>

	{#if showDropdown}
		<div class="vault-explorer-dropdown">
			{#each filteredOptions as option}
				<div
					tabindex="0"
					aria-selected={selectedValue === option}
					role="option"
					class="vault-explorer-dropdown-item"
					on:click={(e) => handleOptionClick(e, option)}
					on:keydown={(e) => {
						if (e.key === "Enter") {
							handleOptionClick(e, option);
						}
					}}
				>
					{option}
				</div>
			{/each}
			{#if filteredOptions.length === 0}
				<div
					class="vault-explorer-dropdown-item vault-explorer-dropdown-item--empty"
				>
					No results found
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.vault-explorer-search-selection {
		position: relative;
	}

	.vault-explorer-search-selection input {
		cursor: default;
		max-width: 300px;
	}

	.vault-explorer-dropdown {
		position: absolute;
		background-color: var(--dropdown-background);
		box-shadow: var(--input-shadow);
		width: 100%;
		max-height: 175px;
		overflow-y: auto;
		z-index: 999;
		color: var(--text-normal);
		font-size: var(--font-ui-small);
		line-height: var(--line-height-tight);
		font-weight: var(--input-font-weight);
		border-radius: var(--input-radius);
	}

	.vault-explorer-dropdown-icon {
		position: absolute;
		top: 50%;
		right: 10px;
		transform: translateY(-50%);
		pointer-events: none;
	}

	.vault-explorer-dropdown-item {
		padding: 6px 8px;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.vault-explorer-dropdown-item:hover {
		background-color: var(--background-modifier-hover);
	}

	.vault-explorer-dropdown-item--empty:hover {
		background-color: transparent;
	}

	.vault-explorer-dropdown-item:focus-visible {
		box-shadow: inset 0 0 0 2px var(--background-modifier-border-focus);
	}
</style>
