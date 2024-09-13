<script lang="ts">
	import { createEventDispatcher, onMount, tick } from "svelte";
	import Icon from "./icon.svelte";

	export let width = "fit-content";
	export let options: string[] = [];
	export let value: string = "";

	let inputValue = value;
	let isOpen = false;
	let dropdownRef: HTMLDivElement | null = null;
	let currentFocusIndex = 0;
	let inputRef: HTMLInputElement | null = null;

	const dispatch = createEventDispatcher();

	onMount(() => {
		document.addEventListener("click", handleClickOutside);

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	});

	async function openDropdown() {
		isOpen = true;
		inputValue = "";

		await tick(); //Wait for the dropdown to be rendered

		if (inputRef && dropdownRef) {
			const inputRect = inputRef.getBoundingClientRect();

			// Set the dropdown position and width based on inputEl
			dropdownRef.style.top = `${inputRect.bottom + 6}px`;
			dropdownRef.style.left = `${inputRect.left}px`;
			dropdownRef.style.width = `${inputRect.width}px`;
		}
	}

	function closeDropdown() {
		isOpen = false;
		inputValue = "";
		currentFocusIndex = 0;
	}

	function handleOptionMouseDown(e: MouseEvent) {
		e.preventDefault();
	}

	function handleOptionClick(option: string) {
		closeDropdown();
		inputValue = option;
		value = option;
		dispatch("select", { value: option });
	}

	function handleInputChange(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		inputValue = value;
		currentFocusIndex = 0;
	}

	function handleInputClick() {
		if (isOpen) {
			closeDropdown();
		} else {
			openDropdown();
		}
	}

	function handleInputKeyDown(e: KeyboardEvent) {
		if (e.key === "Tab") {
			closeDropdown();
			return;
		}

		if (!isOpen) {
			openDropdown();
			return;
		}

		if (e.key === "ArrowDown") {
			currentFocusIndex = currentFocusIndex + 1;
			if (currentFocusIndex == filteredOptions.length) {
				currentFocusIndex = currentFocusIndex - 1;
			}
		} else if (e.key === "ArrowUp") {
			currentFocusIndex = currentFocusIndex - 1;
			if (currentFocusIndex < 0) {
				currentFocusIndex = currentFocusIndex = 0;
			}
		} else if (e.key === "Enter") {
			const option = filteredOptions[currentFocusIndex];
			if (option) {
				handleOptionClick(option);
			}
		}
	}

	function handleClickOutside(e: Event) {
		const targetEl = e.target as HTMLElement;
		const isInsideClick = targetEl.closest(
			".vault-explorer-search-select, .vault-explorer-search-select__dropdown-item",
		);

		if (!isInsideClick && isOpen) {
			console.log("clicking outside");
			closeDropdown();
		}
	}

	function fuzzySearch(input: string) {
		return options.filter((option) =>
			option.toLowerCase().includes(input.toLowerCase()),
		);
	}

	function portalAction(
		node: HTMLElement,
		parent: HTMLElement = document.body,
	) {
		parent = parent || document.body;
		parent.appendChild(node);
	}

	$: filteredOptions = fuzzySearch(inputValue);
</script>

<div class="vault-explorer-search-select" style={`width: ${width}`}>
	<input
		bind:this={inputRef}
		bind:value={inputValue}
		placeholder={value || "Search..."}
		type="text"
		on:input={handleInputChange}
		on:click={handleInputClick}
		on:keydown={handleInputKeyDown}
	/>
	<span class="vault-explorer-search-select__input-icon"
		><Icon iconId="chevron-down" size="xs" /></span
	>

	{#if isOpen}
		<div
			class="vault-explorer-search-select__dropdown"
			bind:this={dropdownRef}
			use:portalAction
		>
			{#each filteredOptions as option, i}
				<div
					tabindex="-1"
					role="option"
					aria-selected={option === value}
					class="vault-explorer-search-select__dropdown-item"
					class:vault-explorer-search-select__dropdown-item--selected={currentFocusIndex ===
						i}
					on:mousedown={handleOptionMouseDown}
					on:click={(e) => handleOptionClick(option)}
					on:keydown={() => {}}
				>
					{option}
				</div>
			{/each}
			{#if filteredOptions.length === 0}
				<div
					class="vault-explorer-search-select__dropdown-item vault-explorer-search-select__dropdown-item--empty"
				>
					No results found
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.vault-explorer-search-select {
		position: relative;
	}

	.vault-explorer-search-select input {
		cursor: default;
		max-width: 300px;
	}

	.vault-explorer-search-select__dropdown {
		position: absolute;
		background-color: var(--dropdown-background);
		box-shadow: var(--input-shadow);
		max-height: 175px;
		overflow-y: auto;
		z-index: 999;
		color: var(--text-normal);
		font-size: var(--font-ui-small);
		line-height: var(--line-height-tight);
		font-weight: var(--input-font-weight);
		border-radius: var(--input-radius);
	}

	.vault-explorer-search-select__input-icon {
		position: absolute;
		top: 50%;
		right: 10px;
		transform: translateY(-50%);
		pointer-events: none;
	}

	.vault-explorer-search-select__dropdown-item {
		padding: 6px 8px;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.vault-explorer-search-select__dropdown-item--selected {
		background-color: var(--color-base-20);
	}

	.vault-explorer-search-select__dropdown-item:hover {
		background-color: var(--color-base-30);
	}

	.vault-explorer-search-select__dropdown-item--empty:hover {
		background-color: transparent;
	}

	.vault-explorer-search-select__dropdown-item:focus-visible {
		box-shadow: inset 0 0 0 2px var(--background-modifier-border-focus);
	}
</style>
