<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";
	import Icon from "./icon.svelte";

	export let width = "fit-content";
	export let options: string[] = [];
	export let value: string = "";

	let inputValue = value;
	let isOpen = false;
	let dropdownRef: HTMLDivElement | null = null;
	let currentFocusIndex = 0;

	const dispatch = createEventDispatcher();

	onMount(() => {
		document.addEventListener("click", handleClickOutside);

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	});

	function openDropdown() {
		isOpen = true;
		inputValue = "";
	}

	function closeDropdown() {
		isOpen = false;
		inputValue = "";
		currentFocusIndex = 0;
	}

	function handleOptionClick(option: string) {
		inputValue = option;
		value = option;
		isOpen = false;
		dispatch("select", { value: option });
	}

	function handleInputChange(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		inputValue = value;
		currentFocusIndex = 0;
	}

	function handleInputFocus() {
		openDropdown();
	}

	function handleInputKeyDown(e: KeyboardEvent) {
		if (e.key === "ArrowDown") {
			if (!isOpen) {
				openDropdown();
				return;
			}
			currentFocusIndex = currentFocusIndex + 1;
			if (currentFocusIndex == filteredOptions.length) {
				currentFocusIndex = currentFocusIndex - 1;
			}
		} else if (e.key === "ArrowUp") {
			if (!isOpen) {
				openDropdown();
				return;
			}

			currentFocusIndex = currentFocusIndex - 1;
			if (currentFocusIndex < 0) {
				currentFocusIndex = currentFocusIndex = 0;
			}
		} else if (e.key === "Enter") {
			if (isOpen) {
				const option = filteredOptions[currentFocusIndex];
				if (option) {
					handleOptionClick(option);
				}
			} else {
				openDropdown();
			}
		} else if (e.key === "Tab") {
			closeDropdown();
		} else {
			// open dropdown on any key press
			if (!isOpen) {
				openDropdown();
			}
		}
	}

	function handleClickOutside(e: Event) {
		const targetEl = e.target as HTMLElement;
		const isInsideClick = targetEl.closest(
			".vault-explorer-search-selection",
		);
		if (!isInsideClick && isOpen) {
			closeDropdown();
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
		placeholder={value || "Search..."}
		type="text"
		on:input={handleInputChange}
		on:focus={handleInputFocus}
		on:keydown={handleInputKeyDown}
	/>
	<span class="vault-explorer-dropdown-icon"
		><Icon iconId="chevron-down" size="xs" /></span
	>

	{#if isOpen}
		<div class="vault-explorer-dropdown" bind:this={dropdownRef}>
			{#each filteredOptions as option, i}
				<div
					tabindex="-1"
					role="option"
					aria-selected={option === value}
					class="vault-explorer-dropdown-item"
					class:vault-explorer-dropdown-item--selected={currentFocusIndex ===
						i}
					on:click={() => handleOptionClick(option)}
					on:keydown={() => {}}
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
		top: calc(100% + 5px);
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

	.vault-explorer-dropdown-item--selected {
		background-color: var(--color-base-20);
	}

	.vault-explorer-dropdown-item:hover {
		background-color: var(--color-base-30);
	}

	.vault-explorer-dropdown-item--empty:hover {
		background-color: transparent;
	}

	.vault-explorer-dropdown-item:focus-visible {
		box-shadow: inset 0 0 0 2px var(--background-modifier-border-focus);
	}
</style>
