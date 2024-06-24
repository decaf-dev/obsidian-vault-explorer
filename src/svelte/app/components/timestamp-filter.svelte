<script lang="ts">
	import { Menu } from "obsidian";
	import IconButton from "src/svelte/shared/components/icon-button.svelte";
	import { TimestampFilterOption } from "src/types";
	import { createEventDispatcher } from "svelte";

	export let value: TimestampFilterOption;

	const dispatch = createEventDispatcher();

	function handleValueChange(value: TimestampFilterOption) {
		dispatch("change", { value });
	}

	function handleButtonClick(e: CustomEvent) {
		const nativeEvent = e.detail.nativeEvent as MouseEvent;

		const menu = new Menu();
		menu.setUseNativeMenu(true);

		menu.addItem((item) => {
			item.setTitle("All");
			item.setChecked(value === "all");
			item.onClick(() => handleValueChange("all"));
		});
		menu.addSeparator();
		menu.addItem((item) => {
			item.setTitle("Modified today");
			item.setChecked(value === "modified-today");
			item.onClick(() => handleValueChange("modified-today"));
		});
		menu.addItem((item) => {
			item.setTitle("Created today");
			item.setChecked(value === "created-today");
			item.onClick(() => handleValueChange("created-today"));
		});
		menu.addSeparator();
		menu.addItem((item) => {
			item.setTitle("Modifed this week");
			item.setChecked(value === "modified-this-week");
			item.onClick(() => handleValueChange("modified-this-week"));
		});
		menu.addItem((item) => {
			item.setTitle("Created this week");
			item.setChecked(value === "created-this-week");
			item.onClick(() => handleValueChange("created-this-week"));
		});
		menu.addSeparator();
		menu.addItem((item) => {
			item.setTitle("Modifed 2 weeks");
			item.setChecked(value === "modified-2-weeks");
			item.onClick(() => handleValueChange("modified-2-weeks"));
		});
		menu.addItem((item) => {
			item.setTitle("Created 2 weeks");
			item.setChecked(value === "created-2-weeks");
			item.onClick(() => handleValueChange("created-2-weeks"));
		});
		menu.showAtMouseEvent(nativeEvent);
	}
</script>

<IconButton
	ariaLabel="Change timestamp filter"
	iconId="clock"
	on:click={handleButtonClick}
/>
