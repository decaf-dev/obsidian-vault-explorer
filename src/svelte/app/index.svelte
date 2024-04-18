<script lang="ts">
	import Stack from "../shared/stack.svelte";
	import Flex from "../shared/flex.svelte";
	import IconButton from "../shared/icon-button.svelte";
	import Checkbox from "../shared/checkbox.svelte";
	import TabList from "../shared/tab-list.svelte";
	import Tab from "../shared/tab.svelte";
	import { Menu, TFile, TFolder } from "obsidian";
	import PropertiesFilterModal from "src/obsidian/properties-filter-modal";
	import { CurrentView, SortFilter, TimestampFilter } from "src/types";
	import store from "./store";
	import VaultExplorerPlugin from "src/main";
	import GridView from "./components/grid-view.svelte";
	import ListView from "./components/list-view.svelte";
	import { MarkdownFileRenderData } from "./types";
	import { favoriteFilter } from "./services/filters/favorite-filter";
	import { filterByFolder } from "./services/filters/folder-filter";
	import { filterBySearch } from "./services/filters/search-filter";
	import { filterByTimestamp } from "./services/filters/timestamp-filter";
	import { filterByProperty } from "./services/filters/property-filter";
	import { formatFileDataForRender } from "./services/render-utils";
	import {
		getMidnightToday,
		getMidnightThisWeek,
		getMidnightLastWeek,
	} from "./services/time-utils";

	let searchFilter = "";
	let folderPath = "/";
	let folders = ["/"];
	let sortFilter: SortFilter = "file-name-asc";
	let timestampFilter: TimestampFilter = "all";
	let onlyFavorites = false;
	let renderData: MarkdownFileRenderData[] = [];
	let currentView: CurrentView = "grid";

	let plugin: VaultExplorerPlugin;
	let folderFiles: TFile[] = [];

	//TODO move to store
	const midnightToday = getMidnightToday();
	const midnightThisWeek = getMidnightThisWeek();
	const midnightLastWeek = getMidnightLastWeek();

	store.plugin.subscribe((p) => {
		plugin = p;

		const allFiles = plugin.app.vault.getFiles();
		folders = allFiles
			.filter((file) => file instanceof TFolder)
			.map((folder) => folder.path);

		const markdownFiles = plugin.app.vault.getMarkdownFiles();

		folderFiles = markdownFiles
			.filter((file) => file instanceof TFile)
			.filter((file) => {
				if (folderPath === "") {
					return true;
				} else if (folderPath === "/") {
					return true;
				}
				return file.path.startsWith(folderPath ?? "/");
			});

		const sortedMarkdownFiles = [...markdownFiles].sort((a, b) => {
			if (sortFilter === "file-name-asc") {
				return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
			} else if (sortFilter === "file-name-desc") {
				return b.name.toLowerCase().localeCompare(a.name.toLowerCase());
			} else if (sortFilter === "modified-asc") {
				return a.stat.mtime - b.stat.mtime;
			} else if (sortFilter === "modified-desc") {
				return b.stat.mtime - a.stat.mtime;
			}
			return 0;
		});

		let filteredData: TFile[] = sortedMarkdownFiles;
		//TODO update every minute
		filteredData = filteredData.filter((file) =>
			filterByTimestamp(file, timestampFilter, {
				midnightToday,
				midnightThisWeek,
				midnightLastWeek,
			}),
		);
		filteredData = filteredData.filter((file) =>
			filterByProperty(
				app,
				file,
				plugin.settings.filters.properties.groups,
			),
		);
		filteredData = filteredData.filter((file) =>
			filterByFolder(file, folderPath),
		);

		renderData = filteredData.map((file) =>
			formatFileDataForRender(plugin.app, plugin.settings, file),
		);
		renderData = renderData.filter((file) =>
			filterBySearch(file, searchFilter),
		);
		renderData = renderData.filter((file) =>
			favoriteFilter(file, onlyFavorites),
		);
	});

	function openPropertiesFilterModal() {
		new PropertiesFilterModal(plugin).open();
	}

	function openSortMenu(e: CustomEvent) {
		const nativeEvent = e.detail.nativeEvent as MouseEvent;
		const menu = new Menu();
		menu.setUseNativeMenu(true);
		menu.addItem((item) => {
			item.setTitle("File name (A-Z)");
			item.setChecked(sortFilter === "file-name-asc");
			item.onClick(() => (sortFilter = "file-name-asc"));
		});
		menu.addItem((item) => {
			item.setTitle("File name (Z-A)");
			item.setChecked(sortFilter === "file-name-desc");
			item.onClick(() => (sortFilter = "file-name-desc"));
		});
		menu.addSeparator();
		menu.addItem((item) => {
			item.setTitle("Modified time (new to old)");
			item.setChecked(sortFilter === "modified-desc");
			item.onClick(() => (sortFilter = "modified-desc"));
		});
		menu.addItem((item) => {
			item.setTitle("Modified time (old to new)");
			item.setChecked(sortFilter === "modified-asc");
			item.onClick(() => (sortFilter = "modified-asc"));
		});
		menu.showAtMouseEvent(nativeEvent);
	}

	function openFolderFilterMenu(e: CustomEvent) {
		const nativeEvent = e.detail.nativeEvent as MouseEvent;

		const menu = new Menu();
		menu.setUseNativeMenu(true);

		for (const folder of folders) {
			menu.addItem((item) => {
				item.setTitle(folder === "/" ? "All" : folder);
				item.setChecked(folderPath === folder);
				item.onClick(() => (folderPath = folder));
			});
		}

		menu.showAtMouseEvent(nativeEvent);
	}

	function openListFilterMenu(e: CustomEvent) {
		const nativeEvent = e.detail.nativeEvent as MouseEvent;

		const menu = new Menu();
		menu.setUseNativeMenu(true);
		menu.addItem((item) => {
			item.setTitle("All");
			item.setChecked(timestampFilter === "all");
			item.onClick(() => (timestampFilter = "all"));
		});
		menu.addSeparator();
		menu.addItem((item) => {
			item.setTitle("Modified today");
			item.setChecked(timestampFilter === "modified-today");
			item.onClick(() => (timestampFilter = "modified-today"));
		});
		menu.addItem((item) => {
			item.setTitle("Created today");
			item.setChecked(timestampFilter === "created-today");
			item.onClick(() => (timestampFilter = "created-today"));
		});
		menu.addSeparator();
		menu.addItem((item) => {
			item.setTitle("Modifed this week");
			item.setChecked(timestampFilter === "modified-this-week");
			item.onClick(() => (timestampFilter = "modified-this-week"));
		});
		menu.addItem((item) => {
			item.setTitle("Created this week");
			item.setChecked(timestampFilter === "created-this-week");
			item.onClick(() => (timestampFilter = "created-this-week"));
		});
		menu.addSeparator();
		menu.addItem((item) => {
			item.setTitle("Modifed 2 weeks");
			item.setChecked(timestampFilter === "modified-2-weeks");
			item.onClick(() => (timestampFilter = "modified-2-weeks"));
		});
		menu.addItem((item) => {
			item.setTitle("Created 2 weeks");
			item.setChecked(timestampFilter === "created-2-weeks");
			item.onClick(() => (timestampFilter = "created-2-weeks"));
		});

		menu.showAtMouseEvent(nativeEvent);
	}

	function handleOnlyFavoritesChange(e: CustomEvent) {
		const nativeEvent = e.detail.nativeEvent;
		onlyFavorites = (nativeEvent.target as HTMLInputElement).checked;
	}
</script>

<div class="vault-explorer">
	<div class="vault-explorer-header">
		<Stack spacing="md">
			<input
				type="text"
				placeholder="Search..."
				bind:value={searchFilter}
			/>
		</Stack>
		<Flex justify="space-between">
			<Stack spacing="sm">
				<Checkbox
					id="favorites"
					label="Favorites"
					value={onlyFavorites}
					on:change={handleOnlyFavoritesChange}
				/>
				<Flex>
					<IconButton
						ariaLabel="Change folder filter"
						iconId="folder"
						on:click={openFolderFilterMenu}
					/>
					<IconButton
						ariaLabel="Change timestamp filter"
						iconId="clock"
						on:click={openListFilterMenu}
					/>
					<IconButton
						ariaLabel="Change properties filter"
						iconId="sliders-horizontal"
						on:click={openPropertiesFilterModal}
					/>
					<IconButton
						ariaLabel="Change sort order"
						iconId="arrow-up-narrow-wide"
						on:click={openSortMenu}
					/>
				</Flex>
			</Stack>
			<div>
				Showing {renderData.length} out of {folderFiles.length}
			</div>
		</Flex>
		<Stack spacing="sm">
			<TabList>
				<Tab on:click={() => (currentView = "grid")}>Grid</Tab>
				<Tab on:click={() => (currentView = "list")}>List</Tab>
			</TabList>
		</Stack>
		{#if currentView === "grid"}
			<GridView data={renderData} />
		{:else}
			<ListView data={renderData} />
		{/if}
	</div>
</div>

<style>
	.vault-explorer {
		display: flex;
		flex-direction: column;
	}

	.vault-explorer-header {
		display: flex;
		flex-direction: column;
		row-gap: 1rem;
		margin-bottom: 2rem;
	}

	.vault-explorer input[type="text"] {
		width: 100%;
		max-width: 300px;
	}
</style>
