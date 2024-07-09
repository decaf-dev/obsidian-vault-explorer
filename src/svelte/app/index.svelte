<script lang="ts">
	// ============================================
	// Imports
	// ============================================
	import Stack from "../shared/components/stack.svelte";
	import Flex from "../shared/components/flex.svelte";
	import FavoritesFilter from "./components/favorites-filter.svelte";
	import TabList from "../shared/components/tab-list.svelte";
	import Tab from "../shared/components/tab.svelte";
	import { TFile } from "obsidian";
	import {
		TCustomFilter,
		TDashboardView,
		TFavoritesFilter,
		TSearchFilter,
		TSortFilter,
		TTimestampFilter,
		TExplorerView,
		TListView,
		TGridView,
		TRecommendedView,
		TRelatedView,
		TTableView,
		TFeedView,
	} from "src/types";
	import store from "../shared/services/store";
	import VaultExplorerPlugin from "src/main";
	import GridView from "./components/grid-view.svelte";
	import ListView from "./components/list-view.svelte";
	import { filterByFavorites } from "./services/filters/favorite-filter";
	import { filterBySearch } from "./services/filters/search-filter";
	import { filterByTimestamp } from "./services/filters/timestamp-filter";
	import { filterByGroups } from "./services/filters/custom/filter-by-groups";
	import { formatFileDataForRender } from "./services/utils/render-utils";
	import _ from "lodash";
	import { onMount } from "svelte";
	import EventManager from "src/event/event-manager";
	import { getDisplayNameForView } from "./services/utils/display-name-utils";
	import {
		getStartOfLastWeekMillis,
		getStartOfTodayMillis,
		getStartOfThisWeekMillis,
	} from "../shared/services/time-utils";
	import { FileRenderData } from "./types";
	import Logger from "js-logger";
	import SearchFilter from "./components/search-filter.svelte";
	import TimestampFilter from "./components/timestamp-filter.svelte";
	import SortFilter from "./components/sort-filter.svelte";
	import { DEBOUNCE_INPUT_TIME } from "./constants";
	import CustomFilter from "./components/custom-filter.svelte";
	import FeedView from "./components/feed-view.svelte";
	import PaginationIndicator from "./components/pagination-indicator.svelte";
	import Wrap from "../shared/components/wrap.svelte";
	import { randomFileSortStore } from "./services/random-file-sort-store";
	import { fileContentStore } from "./services/file-content-store";
	import { fileStore } from "./services/file-store";

	// ============================================
	// Variables
	// ============================================
	let plugin: VaultExplorerPlugin;

	let startOfTodayMillis: number;
	let startOfThisWeekMillis: number;
	let startOfLastWeekMillis: number;

	let pageSize: number = 0;
	let searchFilter: TSearchFilter = {
		isEnabled: true,
		value: "",
	};
	let favoritesFilter: TFavoritesFilter = {
		isEnabled: false,
		value: false,
	};
	let timestampFilter: TTimestampFilter = {
		isEnabled: true,
		value: "all",
	};
	let sortFilter: TSortFilter = {
		isEnabled: true,
		value: "file-name-asc",
	};
	let customFilter: TCustomFilter = {
		isEnabled: true,
		groups: [],
		selectedGroupId: "",
	};

	let currentView: TExplorerView | null = TExplorerView.GRID;

	let frontmatterCacheTime: number = Date.now();
	let propertySettingsTime: number = Date.now();

	let files: TFile[] = [];
	let timeValuesUpdateInterval: NodeJS.Timer | null = null;

	let contentCache: Record<string, string | null> = {};
	let randomSortCache: Record<string, number> = {};

	let dashboardView: TDashboardView = {
		isEnabled: false,
	};

	let listView: TListView = {
		isEnabled: false,
	};

	let gridView: TGridView = {
		isEnabled: false,
	};

	let feedView: TFeedView = {
		isEnabled: false,
	};

	let tableView: TTableView = {
		isEnabled: false,
	};

	let recommendedView: TRecommendedView = {
		isEnabled: false,
	};

	let relatedView: TRelatedView = {
		isEnabled: false,
	};

	let viewOrder: TExplorerView[] = [];

	// ============================================
	// Lifecycle hooks
	// ============================================
	store.plugin.subscribe(async (p) => {
		plugin = p;

		const { app, settings } = plugin;
		pageSize = settings.pageSize;
		searchFilter = settings.filters.search;
		favoritesFilter = settings.filters.favorites;
		sortFilter = settings.filters.sort;
		timestampFilter = settings.filters.timestamp;
		currentView = settings.currentView;
		customFilter = settings.filters.custom;
		dashboardView = settings.views.dashboard;
		listView = settings.views.list;
		gridView = settings.views.grid;
		feedView = settings.views.feed;
		tableView = settings.views.table;
		recommendedView = settings.views.recommended;
		relatedView = settings.views.related;
		viewOrder = settings.viewOrder;

		if (settings.enableClockUpdates) {
			setTimeValuesUpdateInterval();
		}

		fileStore.load(app);
		fileContentStore.load(app);
		randomFileSortStore.load(files);
	});

	randomFileSortStore.subscribe((value) => {
		randomSortCache = value;
	});

	fileContentStore.subscribe((value) => {
		contentCache = value;
	});

	fileStore.subscribe((value) => {
		files = value;
	});

	onMount(() => {
		function handleFilterToggleSettingChange() {
			Logger.trace({
				fileName: "app/index.svelte",
				functionName: "handleFilterToggleSettingChange",
				message: "called",
			});

			searchFilter = plugin.settings.filters.search;
			favoritesFilter = plugin.settings.filters.favorites;
			sortFilter = plugin.settings.filters.sort;
			timestampFilter = plugin.settings.filters.timestamp;
			customFilter = plugin.settings.filters.custom;
		}

		EventManager.getInstance().on(
			"filter-toggle-setting-change",
			handleFilterToggleSettingChange,
		);

		return () => {
			EventManager.getInstance().off(
				"filter-toggle-setting-change",
				handleFilterToggleSettingChange,
			);
		};
	});

	onMount(() => {
		function handleClockUpdatesSettingChange() {
			Logger.trace({
				fileName: "app/index.svelte",
				functionName: "handleClockUpdatesSettingChange",
				message: "called",
			});

			const isEnabled = plugin.settings.enableClockUpdates;
			if (isEnabled) {
				updateTimeValues();
				setTimeValuesUpdateInterval();
			} else if (timeValuesUpdateInterval != null) {
				clearInterval(timeValuesUpdateInterval);
			}
		}

		updateTimeValues();

		EventManager.getInstance().on(
			"clock-updates-setting-change",
			handleClockUpdatesSettingChange,
		);

		return () => {
			if (timeValuesUpdateInterval != null)
				clearInterval(timeValuesUpdateInterval);

			EventManager.getInstance().off(
				"clock-updates-setting-change",
				handleClockUpdatesSettingChange,
			);
		};
	});

	onMount(() => {
		function handlePropertiesFilterUpdate() {
			Logger.trace({
				fileName: "app/index.svelte",
				functionName: "handlePropertiesFilterUpdate",
				message: "called",
			});
			customFilter.groups = plugin.settings.filters.custom.groups;
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
			Logger.trace({
				fileName: "app/index.svelte",
				functionName: "handleCreateFile",
				message: "called",
			});
			if (data.length > 0 && data[0] instanceof TFile) {
				const newFile = data[0] as TFile;

				fileStore.onFileCreate(newFile);
				randomFileSortStore.onFileCreate(newFile.path);
				fileContentStore.onFileCreate(plugin.app, newFile);
			}
		};

		EventManager.getInstance().on("file-create", handleCreateFile);
		return () => {
			EventManager.getInstance().off("file-create", handleCreateFile);
		};
	});

	onMount(() => {
		const handleDeleteFile = (...data: unknown[]) => {
			Logger.trace({
				fileName: "app/index.svelte",
				functionName: "handleDeleteFile",
				message: "called",
			});
			if (data.length > 0 && typeof data[0] === "string") {
				const path = data[0] as string;

				fileStore.onFileDelete(path);
				randomFileSortStore.onFileDelete(path);
				fileContentStore.onFileDelete(path);
			}
		};

		EventManager.getInstance().on("file-delete", handleDeleteFile);
		return () => {
			EventManager.getInstance().off("file-delete", handleDeleteFile);
		};
	});

	onMount(() => {
		const handleFileRename = (...data: unknown[]) => {
			Logger.trace({
				fileName: "app/index.svelte",
				functionName: "handleFileRename",
				message: "called",
			});
			if (data.length < 2) return;
			if (typeof data[0] === "string" && data[1] instanceof TFile) {
				const oldPath = data[0] as string;
				const updatedFile = data[1] as TFile;

				fileStore.onFileRename(oldPath, updatedFile);
				randomFileSortStore.onFileRename(oldPath, updatedFile.path);
				fileContentStore.onFileRename(oldPath, updatedFile.path);
			}
		};

		EventManager.getInstance().on("file-rename", handleFileRename);
		return () => {
			EventManager.getInstance().off("file-rename", handleFileRename);
		};
	});

	onMount(() => {
		const handleFileModify = async (...data: unknown[]) => {
			Logger.trace({
				fileName: "app/index.svelte",
				functionName: "handleFileModify",
				message: "called",
			});
			if (data.length > 0 && data[0] instanceof TFile) {
				const file = data[0] as TFile;
				const content = await plugin.app.vault.cachedRead(file);

				fileContentStore.onFileModify(file.path, content);
			}
		};

		EventManager.getInstance().on("file-modify", handleFileModify);
		return () => {
			EventManager.getInstance().off("file-modify", handleFileModify);
		};
	});

	onMount(() => {
		const handleMetadataChange = (...data: unknown[]) => {
			Logger.trace({
				fileName: "app/index.svelte",
				functionName: "handleMetadataChange",
				message: "called",
			});

			if (data.length > 0 && data[0] instanceof TFile) {
				updateFrontmatterCacheTime();
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
		function handleViewToggleSettingChange() {
			Logger.trace({
				fileName: "app/index.svelte",
				functionName: "handleViewToggleSettingChange",
				message: "called",
			});

			viewOrder = plugin.settings.viewOrder;
			currentView = plugin.settings.currentView;
		}

		EventManager.getInstance().on(
			"view-toggle-setting-change",
			handleViewToggleSettingChange,
		);
		return () => {
			EventManager.getInstance().off(
				"view-toggle-setting-change",
				handleViewToggleSettingChange,
			);
		};
	});

	onMount(() => {
		function handlePageSizeSettingChange() {
			Logger.trace({
				fileName: "app/index.svelte",
				functionName: "handlePageSizeSettingChange",
				message: "called",
			});

			pageSize = plugin.settings.pageSize;
		}

		EventManager.getInstance().on(
			"page-size-setting-change",
			handlePageSizeSettingChange,
		);
		return () => {
			EventManager.getInstance().off(
				"page-size-setting-change",
				handlePageSizeSettingChange,
			);
		};
	});

	onMount(() => {
		function handlePropertySettingChange() {
			Logger.trace({
				fileName: "app/index.svelte",
				functionName: "handlePropertySettingChange",
				message: "called",
			});
			updatePropertySettingTime();
		}

		EventManager.getInstance().on(
			"property-setting-change",
			handlePropertySettingChange,
		);
		return () => {
			EventManager.getInstance().off(
				"property-setting-change",
				handlePropertySettingChange,
			);
		};
	});

	// ============================================
	// Functions
	// ============================================
	const debounceSearchFilterChange = _.debounce((e) => {
		if (searchFilter == null) return;
		searchFilter.value = e.target.value;
	}, DEBOUNCE_INPUT_TIME);

	const debounceFavoriteFilterChange = _.debounce((value) => {
		favoritesFilter.value = value;
	}, DEBOUNCE_INPUT_TIME);

	function updateTimeValues() {
		Logger.trace({
			fileName: "app/index.svelte",
			functionName: "updateTimeValues",
			message: "called",
		});
		startOfTodayMillis = getStartOfTodayMillis();
		startOfThisWeekMillis = getStartOfThisWeekMillis();
		startOfLastWeekMillis = getStartOfLastWeekMillis();
	}

	function setTimeValuesUpdateInterval() {
		const MILLIS_MINUTE = 60000;
		timeValuesUpdateInterval = setInterval(updateTimeValues, MILLIS_MINUTE);
	}

	function updateFrontmatterCacheTime() {
		Logger.trace({
			fileName: "app/index.svelte",
			functionName: "updateFrontmatterCacheTime",
			message: "called",
		});
		frontmatterCacheTime = Date.now();
	}

	function updatePropertySettingTime() {
		propertySettingsTime = Date.now();
	}

	async function saveSettings() {
		plugin.settings.filters.search = searchFilter;
		plugin.settings.filters.sort = sortFilter;
		plugin.settings.filters.timestamp = timestampFilter;
		plugin.settings.filters.favorites = favoritesFilter;
		plugin.settings.views.dashboard = dashboardView;
		plugin.settings.views.list = listView;
		plugin.settings.views.grid = gridView;
		plugin.settings.views.feed = feedView;
		plugin.settings.views.table = tableView;
		plugin.settings.views.recommended = recommendedView;
		plugin.settings.views.related = relatedView;
		plugin.settings.currentView = currentView;
		plugin.settings.filters.custom = customFilter;
		plugin.settings.viewOrder = viewOrder;
		await plugin.saveSettings();
	}

	function handleGroupClick(e: CustomEvent) {
		const { id, nativeEvent } = e.detail;

		const ctrlOrMeta = nativeEvent.ctrlKey || nativeEvent.metaKey;

		const { groups } = customFilter;
		const clickedGroup = groups.find((group) => group.id === id);
		if (!clickedGroup) {
			throw new Error(`Group with id ${id} not found`);
		}

		const newGroups = groups.map((group) => {
			if (group.id === id) {
				if (ctrlOrMeta) {
					const newSticky = !group.isSticky;
					return {
						...group,
						isSticky: newSticky,
						isEnabled: newSticky,
					};
				} else {
					return { ...group, isEnabled: !group.isEnabled };
				}
			} else {
				if (group.isSticky || ctrlOrMeta || clickedGroup.isSticky) {
					return group;
				} else {
					return { ...group, isEnabled: false };
				}
			}
		});
		customFilter.selectedGroupId = id;
		customFilter.groups = newGroups;
	}

	function handleViewDragOver(e: CustomEvent) {
		const { nativeEvent } = e.detail;
		nativeEvent.preventDefault();
	}

	function handleTimestampFilterChange(e: CustomEvent) {
		const { value } = e.detail;
		timestampFilter.value = value;
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

		const { groups } = customFilter;

		const draggedIndex = groups.findIndex((group) => group.id === dragId);
		const dragged = groups.find((group) => group.id === dragId);

		const droppedIndex = groups.findIndex((group) => group.id === id);

		if (!dragged || draggedIndex === -1 || droppedIndex === -1) return;

		let newGroups = [...groups];

		// Remove the dragged item
		newGroups.splice(draggedIndex, 1);

		// Insert the dragged item at the drop index
		newGroups.splice(droppedIndex, 0, dragged);

		customFilter.groups = newGroups;
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

	function handlePageChange(e: CustomEvent) {
		const { value } = e.detail;
		currentPage = value;
	}

	function handleSortChange(e: CustomEvent) {
		const { value } = e.detail;
		sortFilter.value = value;
	}

	function handleFavoritesChange(e: CustomEvent) {
		const nativeEvent = e.detail.nativeEvent;
		const value = (nativeEvent.target as HTMLInputElement).checked;
		debounceFavoriteFilterChange(value);
	}

	// ============================================
	// Reactive statements and computed data
	// ============================================
	let filteredCustom: TFile[] = [];

	$: if (frontmatterCacheTime && customFilter.groups) {
		Logger.debug(`Frontmatter cache time: ${frontmatterCacheTime}`);
		filteredCustom = files.filter((file) => {
			const { name, path } = file;
			const frontmatter =
				plugin.app.metadataCache.getFileCache(file)?.frontmatter;

			const content = contentCache[path] ?? null;

			return filterByGroups(
				name,
				path,
				frontmatter,
				content,
				customFilter.groups,
			);
		});
	}

	let formatted: FileRenderData[] = [];
	$: if (propertySettingsTime) {
		formatted = filteredCustom.map((file) => {
			const frontmatter =
				plugin.app.metadataCache.getFileCache(file)?.frontmatter;

			const content = contentCache[file.path] ?? null;
			return formatFileDataForRender(
				plugin.app,
				plugin.settings,
				file,
				frontmatter,
				content,
			);
		});
	}

	$: filteredSearch = formatted.filter((file) => {
		const { isEnabled, value } = searchFilter;
		if (isEnabled) {
			return filterBySearch(file, value);
		}
		return true;
	});

	$: filteredFavorites = filteredSearch.filter((file) => {
		const { isEnabled, value } = favoritesFilter;
		if (isEnabled) {
			return filterByFavorites(file, value);
		}
		return true;
	});

	$: filteredTimestamp = filteredFavorites.filter((file) => {
		const { modifiedMillis, createdMillis } = file;
		return filterByTimestamp({
			value: timestampFilter.value,
			createdMillis,
			modifiedMillis,
			startOfTodayMillis,
			startOfThisWeekMillis,
			startOfLastWeekMillis,
		});
	});

	$: renderData = [...filteredTimestamp].sort((a, b) => {
		const { value } = sortFilter;
		if (value === "file-name-asc") {
			return a.displayName
				.toLowerCase()
				.localeCompare(b.displayName.toLowerCase());
		} else if (value === "file-name-desc") {
			return b.displayName
				.toLowerCase()
				.localeCompare(a.displayName.toLowerCase());
		} else if (value === "modified-asc") {
			return a.modifiedMillis - b.modifiedMillis;
		} else if (value === "modified-desc") {
			return b.modifiedMillis - a.modifiedMillis;
		} else if (value === "random") {
			const sortKeyA = randomSortCache[a.path] ?? 0;
			const sortKeyB = randomSortCache[b.path] ?? 0;
			return sortKeyA - sortKeyB;
		}
		return 0;
	});

	//TODO fix double save on settings change
	//A settings toggle will save the settings
	//An event will then be emitted and the variable will be
	//updated in this component. This statement will then run
	//and save the settings again
	$: searchFilter,
		sortFilter,
		timestampFilter,
		favoritesFilter,
		currentView,
		customFilter,
		dashboardView,
		listView,
		gridView,
		feedView,
		tableView,
		recommendedView,
		relatedView,
		viewOrder,
		saveSettings();

	$: totalItems = renderData.length;
	$: totalPages = Math.ceil(totalItems / pageSize);

	//When using filters, the total pages can be less than the current page
	//in this case, reset the current page to 1
	$: if (totalPages < currentPage) {
		currentPage = 1;
	}

	let currentPage = 1;
	$: startIndex = (currentPage - 1) * pageSize;
	$: pageLength = Math.min(pageSize, renderData.length - startIndex);
	$: endIndex = startIndex + pageLength;
</script>

<div class="vault-explorer">
	<div class="vault-explorer-header">
		{#if searchFilter.isEnabled}
			<SearchFilter
				value={searchFilter.value}
				on:input={debounceSearchFilterChange}
				on:clear={() => (searchFilter.value = "")}
			/>
		{/if}
		<Stack direction="column" spacing="sm">
			<Flex justify="space-between">
				<Stack spacing="sm">
					{#if favoritesFilter.isEnabled}
						<FavoritesFilter
							value={favoritesFilter.value}
							on:change={handleFavoritesChange}
						/>
					{/if}
					<Flex>
						{#if timestampFilter.isEnabled}
							<TimestampFilter
								value={timestampFilter.value}
								on:change={handleTimestampFilterChange}
							/>
						{/if}
						{#if sortFilter.isEnabled}
							<SortFilter
								value={sortFilter.value}
								on:change={handleSortChange}
							/>
						{/if}
					</Flex>
				</Stack>
			</Flex>
			{#if customFilter.isEnabled}
				<CustomFilter
					groups={customFilter.groups}
					on:groupClick={handleGroupClick}
					on:groupDrop={handleGroupDrop}
					on:groupDragOver={handleGroupDragOver}
					on:groupDragStart={handleGroupDragStart}
				/>
			{/if}
		</Stack>
		<Wrap align="center" spacingY="sm" justify="space-between">
			<div class="vault-explorer-view-select">
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
							>{getDisplayNameForView(view)}</Tab
						>
					{/each}
				</TabList>
			</div>
			<PaginationIndicator
				{startIndex}
				{endIndex}
				{currentPage}
				{totalPages}
				{totalItems}
				on:change={handlePageChange}
			/>
		</Wrap>
		{#if currentView === "grid"}
			<GridView data={renderData} {startIndex} {pageLength} />
		{:else if currentView === "list"}
			<ListView data={renderData} {startIndex} {pageLength} />
		{:else if currentView === "feed"}
			<FeedView data={renderData} {startIndex} {pageLength} />
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

	.vault-explorer-view-select {
		flex: 1;
	}
</style>
