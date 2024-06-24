<script lang="ts">
	// ============================================
	// Imports
	// ============================================
	import Stack from "../shared/components/stack.svelte";
	import Flex from "../shared/components/flex.svelte";
	import IconButton from "../shared/components/icon-button.svelte";
	import FavoritesFilterComponent from "./components/favorites-filter.svelte";
	import TabList from "../shared/components/tab-list.svelte";
	import Tab from "../shared/components/tab.svelte";
	import { TFile } from "obsidian";
	import {
		CustomFilter,
		FavoritesFilter,
		SearchFilter,
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
	import { getDisplayNameForViewType } from "./services/display-name";
	import {
		getStartOfLastWeekMillis,
		getStartOfTodayMillis,
		getStartOfThisWeekMillis,
	} from "../shared/services/time-utils";
	import { FileContent, FileRenderData } from "./types";
	import Logger from "js-logger";
	import SearchFilterComponent from "./components/search-filter.svelte";
	import TimestampFilterComponent from "./components/timestamp-filter.svelte";
	import SortFilterComponent from "./components/sort-filter.svelte";
	import { DEBOUNCE_INPUT_TIME } from "./constants";
	import CustomFilterComponent from "./components/custom-filter.svelte";
	import FeedView from "./components/feed-view.svelte";
	import PaginationIndicator from "./components/pagination-indicator.svelte";
	import Wrap from "../shared/components/wrap.svelte";

	// ============================================
	// Variables
	// ============================================
	let plugin: VaultExplorerPlugin;

	let startOfTodayMillis: number;
	let startOfThisWeekMillis: number;
	let startOfLastWeekMillis: number;

	let pageSize: number = 0;
	let searchFilter: SearchFilter = {
		isEnabled: true,
		value: "",
	};
	let favoritesFilter: FavoritesFilter = {
		isEnabled: false,
		value: false,
	};
	let timestampFilter: TimestampFilter = {
		isEnabled: true,
		value: "all",
	};
	let sortFilter: SortFilter = {
		isEnabled: true,
		value: "file-name-asc",
	};
	let customFilter: CustomFilter = {
		isEnabled: true,
		groups: [],
		selectedGroupId: "",
	};

	let viewOrder: ViewType[] = [];
	let currentView: ViewType = ViewType.GRID;

	let frontmatterCacheTime: number = Date.now();
	let propertySettingTime: number = Date.now();

	let files: TFile[] = [];
	let timeValuesUpdateInterval: NodeJS.Timer | null = null;
	let contentForFiles: FileContent[] = [];

	// ============================================
	// Lifecycle hooks
	// ============================================
	store.plugin.subscribe(async (p) => {
		plugin = p;

		const { app, settings } = plugin;
		files = app.vault.getFiles();
		pageSize = settings.pageSize;
		searchFilter = settings.filters.search;
		favoritesFilter = settings.filters.favorites;
		sortFilter = settings.filters.sort;
		timestampFilter = settings.filters.timestamp;
		currentView = settings.views.currentView;
		viewOrder = settings.views.order;
		customFilter = settings.filters.custom;

		if (settings.views.enableClockUpdates) {
			setTimeValuesUpdateInterval();
		}

		contentForFiles = await loadContentForFiles(files);
	});

	onMount(() => {
		function handleFilterToggleSettingChange() {
			Logger.trace({
				fileName: "app/index.ts",
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
				fileName: "app/index.ts",
				functionName: "handleClockUpdatesSettingChange",
				message: "called",
			});

			const isEnabled = plugin.settings.views.enableClockUpdates;
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
				fileName: "app/index.ts",
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
				fileName: "app/index.ts",
				functionName: "handleCreateFile",
				message: "called",
			});
			if (data.length > 0 && data[0] instanceof TFile) {
				const newFile = data[0] as TFile;
				files = [...files, newFile];
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
				fileName: "app/index.ts",
				functionName: "handleDeleteFile",
				message: "called",
			});
			if (data.length > 0 && typeof data[0] === "string") {
				const path = data[0] as string;
				files = files.filter((file) => file.path !== path);
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
				fileName: "app/index.ts",
				functionName: "handleFileRename",
				message: "called",
			});
			if (data.length < 2) return;
			if (typeof data[0] === "string" && data[1] instanceof TFile) {
				const oldPath = data[0] as string;
				const updatedFile = data[1] as TFile;
				files = files.map((file) => {
					if (file.path === oldPath) {
						return updatedFile;
					}
					return file;
				});
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
			Logger.trace({
				fileName: "app/index.ts",
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
		function handlePageSizeSettingChange() {
			Logger.trace({
				fileName: "app/index.ts",
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
				fileName: "app/index.ts",
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
			fileName: "app/index.ts",
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

	async function loadContentForFiles(files: TFile[]): Promise<FileContent[]> {
		const promises: Promise<FileContent>[] = [];

		for (let file of files) {
			promises.push(
				(async () => {
					const { extension } = file;
					if (extension === "md") {
						const content = await plugin.app.vault.cachedRead(file);
						return {
							path: file.path,
							content,
						};
					}
					return {
						path: file.path,
						content: null,
					};
				})(),
			);
		}

		const results = await Promise.all(promises);
		return results;
	}

	function updateFrontmatterCacheTime() {
		Logger.trace({
			fileName: "app/index.ts",
			functionName: "updateFrontmatterCacheTime",
			message: "called",
		});
		frontmatterCacheTime = Date.now();
	}

	function updatePropertySettingTime() {
		propertySettingTime = Date.now();
	}

	async function saveSettings() {
		plugin.settings.filters.search = searchFilter;
		plugin.settings.filters.sort = sortFilter;
		plugin.settings.filters.timestamp = timestampFilter;
		plugin.settings.filters.favorites = favoritesFilter;
		plugin.settings.views.order = viewOrder;
		plugin.settings.views.currentView = currentView;
		plugin.settings.filters.custom = customFilter;
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
		console.log("Frontmatter cache time", frontmatterCacheTime);
		filteredCustom = files.filter((file) => {
			const { name, path } = file;
			const frontmatter =
				plugin.app.metadataCache.getFileCache(file)?.frontmatter;

			let content =
				contentForFiles.find((content) => content.path === path)
					?.content ?? "";

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
	$: if (propertySettingTime) {
		formatted = filteredCustom.map((file) => {
			const frontmatter =
				plugin.app.metadataCache.getFileCache(file)?.frontmatter;
			const content =
				contentForFiles.find((content) => content.path === file.path)
					?.content ?? null;
			return formatFileDataForRender(
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
		if (sortFilter.value === "file-name-asc") {
			return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
		} else if (sortFilter.value === "file-name-desc") {
			return b.name.toLowerCase().localeCompare(a.name.toLowerCase());
		} else if (sortFilter.value === "modified-asc") {
			return a.modifiedMillis - b.modifiedMillis;
		} else if (sortFilter.value === "modified-desc") {
			return b.modifiedMillis - a.modifiedMillis;
		}
		return 0;
	});

	$: searchFilter,
		sortFilter,
		timestampFilter,
		favoritesFilter,
		currentView,
		viewOrder,
		customFilter,
		saveSettings();

	$: totalItems = renderData.length;
	$: totalPages = Math.ceil(totalItems / pageSize);

	let currentPage = 1;
	$: startIndex = (currentPage - 1) * pageSize;
	$: pageLength = Math.min(pageSize, renderData.length - startIndex);
	$: endIndex = startIndex + pageLength;
</script>

<div class="vault-explorer">
	<div class="vault-explorer-header">
		{#if searchFilter.isEnabled}
			<SearchFilterComponent
				value={searchFilter.value}
				on:input={debounceSearchFilterChange}
				on:clear={() => (searchFilter.value = "")}
			/>
		{/if}
		<Stack direction="column" spacing="sm">
			<Flex justify="space-between">
				<Stack spacing="sm">
					{#if favoritesFilter.isEnabled}
						<FavoritesFilterComponent
							value={favoritesFilter.value}
							on:change={handleFavoritesChange}
						/>
					{/if}
					<Flex>
						{#if timestampFilter.isEnabled}
							<TimestampFilterComponent
								value={timestampFilter.value}
								on:change={handleTimestampFilterChange}
							/>
						{/if}
						{#if sortFilter.isEnabled}
							<SortFilterComponent
								value={sortFilter.value}
								on:change={handleSortChange}
							/>
						{/if}
					</Flex>
				</Stack>
			</Flex>
			{#if customFilter.isEnabled}
				<CustomFilterComponent
					groups={customFilter.groups}
					on:groupClick={handleGroupClick}
					on:groupDrop={handleGroupDrop}
					on:groupDragOver={handleGroupDragOver}
					on:groupDragStart={handleGroupDragStart}
				/>
			{/if}
		</Stack>
		<Wrap align="center" spacingY="sm" justify="space-between">
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
			<FeedView data={renderData} />
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
</style>
