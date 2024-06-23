<script lang="ts">
	import { FilterCondition, FilterOperator, FilterRuleType } from "src/types";
	import FilterRule from "./filter-rule.svelte";

	export let index: number;
	export let id: string;
	export let type: FilterRuleType;
	export let value: string;
	export let includeSubfolders: boolean;
	export let operator: FilterOperator;
	export let condition: FilterCondition;
	export let isEnabled: boolean;

	let plugin: VaultExplorerPlugin;
	let folders: string[] = [];

	store.plugin.subscribe((p) => {
		plugin = p;

		const allFiles = plugin.app.vault.getAllLoadedFiles();
		folders = allFiles
			.filter((file) => file instanceof TFolder)
			.map((folder) => folder.path);
	});

	onMount(() => {
		const handleFolderRename = (...data: unknown[]) => {
			if (data.length < 2) return;
			if (typeof data[0] === "string" && data[1] instanceof TFolder) {
				const oldPath = data[0] as string;
				const updatedFolder = data[1] as TFolder;
				folders = folders.map((folder) => {
					if (folder === oldPath) {
						return updatedFolder.path;
					}
					return folder;
				});

				if (oldPath === value) {
					dispatch("ruleValueChange", {
						id,
						value: updatedFolder.path,
					});
				}
			}
		};

		EventManager.getInstance().on("folder-rename", handleFolderRename);
		return () => {
			EventManager.getInstance().off("folder-rename", handleFolderRename);
		};
	});

	onMount(() => {
		const handleFolderCreate = (...data: unknown[]) => {
			if (data.length > 0 && typeof data[0] === "string") {
				const newFolder = data[0] as string;
				folders = [...folders, newFolder];
			}
		};

		EventManager.getInstance().on("folder-create", handleFolderCreate);
		return () => {
			EventManager.getInstance().off("folder-create", handleFolderCreate);
		};
	});

	onMount(() => {
		const handleDeleteFolder = (...data: unknown[]) => {
			if (data.length > 0 && typeof data[0] === "string") {
				const path = data[0] as string;
				folders = folders.filter((folder) => folder !== path);

				dispatch("ruleValueChange", { id, value: "" });
			}
		};

		EventManager.getInstance().on("folder-delete", handleDeleteFolder);
		return () => {
			EventManager.getInstance().off("folder-delete", handleDeleteFolder);
		};
	});

	import { createEventDispatcher, onMount } from "svelte";
	import store from "src/svelte/shared/services/store";
	import { TFolder } from "obsidian";
	import VaultExplorerPlugin from "src/main";
	import EventManager from "src/event/event-manager";
	const dispatch = createEventDispatcher();

	function handleValueChange(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		dispatch("ruleValueChange", { id, value });
	}

	function handleSubFoldersToggle(e: Event) {
		const value = (e.target as HTMLInputElement).checked;
		dispatch("folderSubfoldersToggle", { id, includeSubfolders: value });
	}
</script>

<FilterRule
	propertyType={null}
	{index}
	{id}
	{type}
	{operator}
	{condition}
	{isEnabled}
	on:ruleDeleteClick
	on:ruleTypeChange
	on:ruleConditionChange
	on:ruleOperatorChange
	on:ruleToggle
>
	<svelte:fragment slot="after-condition">
		<select {value} on:change={handleValueChange}>
			<option value="">select a folder</option>
			{#each folders as folder}
				<option value={folder}>{folder}</option>
			{/each}
		</select>
		<input
			aria-label="Include subfolders"
			type="checkbox"
			checked={includeSubfolders}
			on:change={handleSubFoldersToggle}
		/>
	</svelte:fragment>
</FilterRule>
