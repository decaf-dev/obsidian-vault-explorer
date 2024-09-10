<script lang="ts">
	import { Menu } from "obsidian";
	import IconButton from "src/svelte/shared/components/icon-button.svelte";
	import { SortFilterOption } from "src/types";
	import { createEventDispatcher } from "svelte";

	export let value: SortFilterOption;

	const dispatch = createEventDispatcher();

	function handleValueChange(value: SortFilterOption) {
		dispatch("change", { value });
	}

	function handleButtonClick(e: CustomEvent) {
		const nativeEvent = e.detail.nativeEvent as MouseEvent;
		const menu = new Menu();
		menu.setUseNativeMenu(true);
		menu.addItem((item) => {
			item.setTitle("File name (A-Z)");
			item.setChecked(value === "file-name-asc");
			item.onClick(() => handleValueChange("file-name-asc"));
		});
		menu.addItem((item) => {
			item.setTitle("File name (Z-A)");
			item.setChecked(value === "file-name-desc");
			item.onClick(() => handleValueChange("file-name-desc"));
		});
		menu.addSeparator();
		menu.addItem((item) => {
			item.setTitle("Modified time (new to old)");
			item.setChecked(value === "modified-desc");
			item.onClick(() => handleValueChange("modified-desc"));
		});
		menu.addItem((item) => {
			item.setTitle("Modified time (old to new)");
			item.setChecked(value === "modified-asc");
			item.onClick(() => handleValueChange("modified-asc"));
		});
		menu.addSeparator();
		menu.addItem((item) => {
			item.setTitle("Created time (new to old)");
			item.setChecked(value === "created-desc");
			item.onClick(() => handleValueChange("created-desc"));
		});
		menu.addItem((item) => {
			item.setTitle("Created time (old to new)");
			item.setChecked(value === "created-asc");
			item.onClick(() => handleValueChange("created-asc"));
		});
		menu.addSeparator();
		menu.addItem((item) => {
			item.setTitle("Random");
			item.setChecked(value === "random");
			item.onClick(() => handleValueChange("random"));
		});
		menu.showAtMouseEvent(nativeEvent);
	}
</script>

<IconButton
	ariaLabel="Change sort order"
	iconId="arrow-up-narrow-wide"
	on:click={handleButtonClick}
/>
