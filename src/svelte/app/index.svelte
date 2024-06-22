<script lang="ts">
	import Stack from "../shared/components/stack.svelte";
	import Flex from "../shared/components/flex.svelte";
	import IconButton from "../shared/components/icon-button.svelte";
	import Checkbox from "../shared/components/checkbox.svelte";
	import TabList from "../shared/components/tab-list.svelte";
	import Tab from "../shared/components/tab.svelte";
	import { FrontMatterCache, Menu, TFile, TFolder } from "obsidian";
	import PropertiesFilterModal from "src/obsidian/properties-filter-modal";
	import {
		FilterGroup,
		SortFilter,
		TimestampFilter,
		ViewType,
	} from "src/types";
	import store from "../shared/services/store";
	import VaultExplorerPlugin from "src/main";
	import GridView from "./components/grid-view.svelte";
	import ListView from "./components/list-view.svelte";
	import { filterByFavorites } from "./services/filters/favorite-filter";
	import { filterBySearch } from "./services/filters/search-filter";
	import { filterByTimestamp } from "./services/filters/timestamp-filter";
	import { filterByGroups } from "./services/filters/custom/filter-by-groups";
	import { formatFileDataForRender } from "./services/render-utils";
	import _ from "lodash";
	import { onMount } from "svelte";
	import EventManager from "src/event/event-manager";
	import GroupTagList from "./components/group-tag-list.svelte";
	import { getDisplayNameForViewType } from "./services/display-name";
	import {
		getStartOfLastWeekMillis,
		getStartOfTodayMillis,
		getStartOfThisWeekMillis,
	} from "../shared/services/time-utils";

	let plugin: VaultExplorerPlugin;

	let startOfTodayMillis: number;
	let startOfThisWeekMillis: number;
	let startOfLastWeekMillis: number;

	function updateTimeValues() {
		startOfTodayMillis = getStartOfTodayMillis();
		startOfThisWeekMillis = getStartOfThisWeekMillis();
		startOfLastWeekMillis = getStartOfLastWeekMillis();
	}

	onMount(() => {
		updateTimeValues();
		const interval = setInterval(updateTimeValues, 60000); // Update every minute

		return () => {
			clearInterval(interval);
		};
	});

	let folders: string[] = [];
	let pageSize: number = 0;

	let searchFilter: string = "";
	let sortFilter: SortFilter = "file-name-asc";
	let timestampFilter: TimestampFilter = "all";
	let onlyFavorites: boolean = false;
	let viewOrder: ViewType[] = [];
	let currentView: ViewType = ViewType.GRID;
	let propertyFilterGroups: FilterGroup[] = [];
	let selectedPropertyFilterGroupId: string = "";

	let frontmatterCache: Record<string, FrontMatterCache | undefined> = {};

	let markdownFiles: TFile[] = [];

	const debounceSearchFilter = _.debounce((e) => {
		searchFilter = e.target.value;
	}, 300);

	const debounceFavoriteFilter = _.debounce((value) => {
		onlyFavorites = value;
	}, 300);

	function updateFrontmatterCache() {
		let localCache: Record<string, FrontMatterCache | undefined> = {};
		markdownFiles.forEach((file) => {
			const frontmatter =
				plugin.app.metadataCache.getFileCache(file)?.frontmatter;

			localCache[file.path] = frontmatter;
		});

		frontmatterCache = localCache;
	}

	store.plugin.subscribe((p) => {
		plugin = p;

		const allFiles = plugin.app.vault.getAllLoadedFiles();
		folders = allFiles
			.filter((file) => file instanceof TFolder)
			.map((folder) => folder.path);

		markdownFiles = plugin.app.vault.getMarkdownFiles();
		updateFrontmatterCache();

		pageSize = plugin.settings.pageSize;

		searchFilter = plugin.settings.filters.search;
		sortFilter = plugin.settings.filters.sort;
		timestampFilter = plugin.settings.filters.timestamp;
		onlyFavorites = plugin.settings.filters.onlyFavorites;
		currentView = plugin.settings.views.currentView;
		viewOrder = plugin.settings.views.order;
		propertyFilterGroups = plugin.settings.filters.custom.groups;
		selectedPropertyFilterGroupId =
			plugin.settings.filters.custom.selectedGroupId;
	});

	onMount(() => {
		function handlePropertiesFilterUpdate() {
			propertyFilterGroups = plugin.settings.filters.custom.groups;
			selectedPropertyFilterGroupId =
				plugin.settings.filters.custom.selectedGroupId;
		}

		EventManager.getInstance().on(
			"properties-filter-update",
			handlePropertiesFilterUpdate,
		);
		return () => {
			EventManager.getInstance().off(
				"properties-filter-update",
				handlePropertiesFilterUpdate,
			);
		};
	});

	onMount(() => {
		const handleCreateFile = (...data: unknown[]) => {
			// console.log("file-create event triggered");
			if (data.length > 0 && data[0] instanceof TFile) {
				const newFile = data[0] as TFile;
				markdownFiles = [...markdownFiles, newFile];
			}
		};

		EventManager.getInstance().on("file-create", handleCreateFile);
		return () => {
			EventManager.getInstance().off("file-create", handleCreateFile);
		};
	});

	onMount(() => {
		const handleDeleteFile = (...data: unknown[]) => {
			// console.log("file-delete event triggered");
			if (data.length > 0 && typeof data[0] === "string") {
				const path = data[0] as string;
				markdownFiles = markdownFiles.filter(
					(file) => file.path !== path,
				);
			}
		};

		EventManager.getInstance().on("file-delete", handleDeleteFile);
		return () => {
			EventManager.getInstance().off("file-delete", handleDeleteFile);
		};
	});

	onMount(() => {
		const handleFileRename = (...data: unknown[]) => {
			// console.log("file-rename event triggered");
			if (data.length < 2) return;
			if (typeof data[0] === "string" && data[1] instanceof TFile) {
				const oldPath = data[0] as string;
				const updatedFile = data[1] as TFile;
				markdownFiles = markdownFiles.map((file) => {
					if (file.path === oldPath) {
						return updatedFile;
					}
					return file;
				});

				if (frontmatterCache[oldPath]) {
					frontmatterCache = {
						...frontmatterCache,
						[updatedFile.path]: frontmatterCache[oldPath],
					};
				}
			}
		};

		const debounceHandleFileRename = _.debounce(handleFileRename, 300);

		EventManager.getInstance().on("file-rename", debounceHandleFileRename);
		return () => {
			EventManager.getInstance().off(
				"file-rename",
				debounceHandleFileRename,
			);
		};
	});

	onMount(() => {
		const handleMetadataChange = (...data: unknown[]) => {
			// console.log("metadata-change event triggered");
			if (data.length > 0 && data[0] instanceof TFile) {
				const file = data[0] as TFile;

				const frontmatter =
					plugin.app.metadataCache.getFileCache(file)?.frontmatter;

				frontmatterCache = {
					...frontmatterCache,
					[file.path]: frontmatter,
				};
			}
		};

		EventManager.getInstance().on("metadata-change", handleMetadataChange);
		return () => {
			EventManager.getInstance().off(
				"metadata-change",
				handleMetadataChange,
			);
		};
	});

	onMount(() => {
		function handlePageSizeChange() {
			pageSize = plugin.settings.pageSize;
		}

		EventManager.getInstance().on(
			"page-size-setting-change",
			handlePageSizeChange,
		);
		return () => {
			EventManager.getInstance().off(
				"page-size-setting-change",
				handlePageSizeChange,
			);
		};
	});

	onMount(() => {
		function handlePropertyChange() {
			updateFrontmatterCache();
		}

		EventManager.getInstance().on(
			"property-setting-change",
			handlePropertyChange,
		);
		return () => {
			EventManager.getInstance().off(
				"property-setting-change",
				handlePropertyChange,
			);
		};
	});

	$: filteredCustom = [...markdownFiles].filter((file) => {
		const frontmatter = frontmatterCache[file.path];
		return filterByGroups(file, frontmatter, propertyFilterGroups);
	});

	$: formatted = filteredCustom.map((file) => {
		const frontmatter = frontmatterCache[file.path];
		return formatFileDataForRender(plugin.settings, file, frontmatter);
	});

	$: filteredSearch = formatted.filter((file) =>
		filterBySearch(file, searchFilter),
	);

	$: filteredFavorites = filteredSearch.filter((file) =>
		filterByFavorites(file, onlyFavorites),
	);

	$: filteredTimestamp = filteredFavorites.filter((file) => {
		const { modifiedMillis, createdMillis } = file;
		return filterByTimestamp({
			createdMillis,
			modifiedMillis,
			timestampFilter,
			startOfTodayMillis,
			startOfThisWeekMillis,
			startOfLastWeekMillis,
		});
	});

	$: renderData = [...filteredTimestamp].sort((a, b) => {
		if (sortFilter === "file-name-asc") {
			return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
		} else if (sortFilter === "file-name-desc") {
			return b.name.toLowerCase().localeCompare(a.name.toLowerCase());
		} else if (sortFilter === "modified-asc") {
			return a.modifiedMillis - b.modifiedMillis;
		} else if (sortFilter === "modified-desc") {
			return b.modifiedMillis - a.modifiedMillis;
		}
		return 0;
	});

	$: searchFilter,
		sortFilter,
		timestampFilter,
		onlyFavorites,
		currentView,
		viewOrder,
		propertyFilterGroups,
		selectedPropertyFilterGroupId,
		saveSettings();

	async function saveSettings() {
		plugin.settings.filters.search = searchFilter;
		plugin.settings.filters.sort = sortFilter;
		plugin.settings.filters.timestamp = timestampFilter;
		plugin.settings.filters.onlyFavorites = onlyFavorites;
		plugin.settings.views.order = viewOrder;
		plugin.settings.views.currentView = currentView;
		plugin.settings.filters.custom.groups = propertyFilterGroups;
		plugin.settings.filters.custom.selectedGroupId =
			selectedPropertyFilterGroupId;
		await plugin.saveSettings();
	}

	function handleGroupClick(e: CustomEvent) {
		const { id } = e.detail;

		const newGroups = propertyFilterGroups.map((group) =>
			group.id === id
				? { ...group, isEnabled: !group.isEnabled }
				: { ...group, isEnabled: false },
		);
		selectedPropertyFilterGroupId = id;
		propertyFilterGroups = newGroups;
	}

	function handleViewDragOver(e: CustomEvent) {
		const { nativeEvent } = e.detail;
		nativeEvent.preventDefault();
	}

	function handleViewDragStart(e: CustomEvent, id: string) {
		const { nativeEvent } = e.detail;
		nativeEvent.dataTransfer.setData("text", id);
		nativeEvent.dataTransfer.effectAllowed = "move";
	}

	function handleViewDrop(e: CustomEvent, id: string) {
		const { nativeEvent } = e.detail;
		const dragId = nativeEvent.dataTransfer.getData("text");
		nativeEvent.dataTransfer.dropEffect = "move";

		const draggedIndex = viewOrder.findIndex((view) => view === dragId);
		const dragged = viewOrder.find((view) => view === dragId);

		const droppedIndex = viewOrder.findIndex((view) => view === id);
		const dropped = viewOrder.find((view) => view === id);

		if (!dragged || !dropped || draggedIndex === -1 || droppedIndex === -1)
			return;

		let newViewOrder = [...viewOrder];
		newViewOrder[draggedIndex] = dropped;
		newViewOrder[droppedIndex] = dragged;
		viewOrder = newViewOrder;
	}

	function handleGroupDrop(e: CustomEvent) {
		const { id, nativeEvent } = e.detail;
		const dragId = nativeEvent.dataTransfer.getData("text");
		nativeEvent.dataTransfer.dropEffect = "move";

		const draggedIndex = propertyFilterGroups.findIndex(
			(group) => group.id === dragId,
		);
		const dragged = propertyFilterGroups.find(
			(group) => group.id === dragId,
		);

		const droppedIndex = propertyFilterGroups.findIndex(
			(group) => group.id === id,
		);

		if (!dragged || draggedIndex === -1 || droppedIndex === -1) return;

		let newGroups = [...propertyFilterGroups];

		// Remove the dragged item
		newGroups.splice(draggedIndex, 1);

		// Insert the dragged item at the drop index
		newGroups.splice(droppedIndex, 0, dragged);

		propertyFilterGroups = newGroups;
	}

	function handleGroupDragOver(e: CustomEvent) {
		const { nativeEvent } = e.detail;
		nativeEvent.preventDefault();
	}

	function handleGroupDragStart(e: CustomEvent) {
		const { id, nativeEvent } = e.detail;
		nativeEvent.dataTransfer.setData("text", id);
		nativeEvent.dataTransfer.effectAllowed = "move";

		//Set drag image
		//The drag image by default will be square
		//We can create a custom drag image by cloning the target element
		const dragImage = nativeEvent.target.cloneNode(true);
		const rect = nativeEvent.target.getBoundingClientRect();
		dragImage.style.position = "absolute";
		dragImage.style.top = "-9999px"; // Hide the element
		dragImage.style.left = "-9999px"; // Hide the element
		document.body.appendChild(dragImage);

		nativeEvent.dataTransfer.setDragImage(
			dragImage,
			rect.width / 2,
			rect.height / 2,
		);

		nativeEvent.target.addEventListener("dragend", () => {
			dragImage.remove();
		});
	}

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
		const value = (nativeEvent.target as HTMLInputElement).checked;
		debounceFavoriteFilter(value);
	}

	let currentPage = 1;
	$: totalItems = renderData.length;
	$: totalPages = Math.ceil(totalItems / pageSize);

	$: startIndex = (currentPage - 1) * pageSize;
	$: pageLength = Math.min(pageSize, renderData.length - startIndex);
	$: endIndex = startIndex + pageLength;

	function changePage(newPage: number) {
		currentPage = newPage;
	}
</script>

<div class="vault-explorer">
	<div class="vault-explorer-header">
		<Stack spacing="md">
			<div class="vault-explorer-search-container">
				<input
					type="text"
					placeholder="Search..."
					value={searchFilter}
					on:input={debounceSearchFilter}
				/>
				{#if searchFilter.length > 0}
					<div
						tabindex="0"
						role="button"
						aria-label="Clear search"
						class="search-input-clear-button"
						on:click={() => (searchFilter = "")}
						on:keydown={(e) => {
							if (e.key === "Enter") {
								searchFilter = "";
							}
						}}
					/>
				{/if}
			</div>
		</Stack>
		<Stack direction="column" spacing="sm">
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
							ariaLabel="Change timestamp filter"
							iconId="clock"
							on:click={openListFilterMenu}
						/>
						<IconButton
							ariaLabel="Change sort order"
							iconId="arrow-up-narrow-wide"
							on:click={openSortMenu}
						/>
					</Flex>
				</Stack>
			</Flex>
			<Stack align="center" spacing="sm">
				{#if propertyFilterGroups.length > 0}
					<GroupTagList
						groups={propertyFilterGroups}
						on:groupClick={handleGroupClick}
						on:groupDrop={handleGroupDrop}
						on:groupDragOver={handleGroupDragOver}
						on:groupDragStart={handleGroupDragStart}
					/>
				{/if}
				{#if propertyFilterGroups.length === 0}
					<span class="vault-explorer-empty-label">No groups</span>
				{/if}
				<IconButton
					ariaLabel="Change custom filter"
					iconId="ellipsis-vertical"
					on:click={openPropertiesFilterModal}
				/>
			</Stack>
		</Stack>
		<Flex>
			<TabList
				initialSelectedIndex={viewOrder.findIndex(
					(view) => view === currentView,
				)}
			>
				{#each viewOrder as view}
					<Tab
						draggable={true}
						on:click={() => (currentView = view)}
						on:dragstart={(e) => handleViewDragStart(e, view)}
						on:dragover={handleViewDragOver}
						on:drop={(e) => handleViewDrop(e, view)}
						>{getDisplayNameForViewType(view)}</Tab
					>
				{/each}
			</TabList>
			<Stack justify="flex-end" align="center">
				<Stack spacing="xs">
					<Stack spacing="xs">
						<span>{startIndex + 1}</span>
						<span>-</span>
						<span>{endIndex}</span>
					</Stack>
					<span>of</span>
					<span>{renderData.length}</span>
				</Stack>
				<Flex>
					<IconButton
						iconId="chevrons-left"
						ariaLabel="First page"
						on:click={() => changePage(1)}
					/>
					<IconButton
						iconId="chevron-left"
						ariaLabel="Previous page"
						disabled={currentPage === 1}
						on:click={() => changePage(currentPage - 1)}
					/>
					<IconButton
						iconId="chevron-right"
						ariaLabel="Next page"
						disabled={currentPage === totalPages}
						on:click={() => changePage(currentPage + 1)}
					/>
					<IconButton
						iconId="chevrons-right"
						ariaLabel="Last page"
						on:click={() => changePage(totalPages)}
					/>
				</Flex>
			</Stack>
		</Flex>
		{#if currentView === "grid"}
			<GridView data={renderData} {startIndex} {pageLength} />
		{:else}
			<ListView data={renderData} {startIndex} {pageLength} />
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
	}

	.vault-explorer-search-container {
		position: relative;
		width: 100%;
		max-width: 300px;
	}

	.vault-explorer-empty-label {
		color: var(--text-faint);
		font-size: var(--font-smaller);
	}
</style>
