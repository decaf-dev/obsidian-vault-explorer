<script lang="ts">
	// ============================================
	// Imports
	// ============================================
	import Stack from "../shared/components/stack.svelte";
	import Flex from "../shared/components/flex.svelte";
	import FavoritesFilter from "./components/favorites-filter.svelte";
	import TabList from "../shared/components/tab-list.svelte";
	import Tab from "../shared/components/tab.svelte";
	import { Notice, TFile } from "obsidian";
	import {
		TCustomFilter,
		TFavoritesFilter,
		TSearchFilter,
		TSortFilter,
		TTimestampFilter,
		TExplorerView,
	} from "src/types";
	import store from "../shared/services/store";
	import VaultExplorerPlugin from "src/main";
	import GridView from "./components/grid-view.svelte";
	import ListView from "./components/list-view.svelte";
	import { filterByFavorites } from "./services/filters/favorite-filter";
	import { filterBySearch } from "./services/filters/search-filter";
	import { filterByTimestamp } from "./services/filters/timestamp-filter";
	import { filterByGroups } from "./services/filters/custom/filter-by-groups";
	import { formatFileDataForRender } from "./services/render-data";
	import _ from "lodash";
	import { onMount } from "svelte";
	import EventManager from "src/event/event-manager";
	import { getDisplayNameForView } from "./services/display-name";
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
	import FeedView from "./components/feed-view.svelte";
	import PaginationIndicator from "./components/pagination-indicator.svelte";
	import Wrap from "../shared/components/wrap.svelte";
	import {
		RandomFileSortCache,
		randomFileSortStore,
	} from "./services/random-file-sort-store";
	import {
		FileContentCache,
		fileContentStore,
	} from "./services/file-content-store";
	import { fileStore, LoadedFile } from "./services/file-store";
	import IconButton from "../shared/components/icon-button.svelte";
	import CustomFilterModal from "src/obsidian/custom-filter-modal";
	import FilterGroupList from "./components/filter-group-list.svelte";
	import { PluginEvent } from "src/event/types";
	import {
		favoritesStore,
		TFavoritesCache,
	} from "./services/favorites-store";
	import TableView from "./components/table-view.svelte";

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
	let coverImageSourcesTime: number = Date.now();
	let loadBodyTagsTime: number = Date.now();

	let loadedFiles: LoadedFile[] = [];
	let timeValuesUpdateInterval: NodeJS.Timer | null = null;

	let favoritesCache: TFavoritesCache = new Map();
	let contentCache: FileContentCache = new Map();
	let randomSortCache: RandomFileSortCache = new Map();

	let viewOrder: TExplorerView[] = [];

	// ============================================
	// Lifecycle hooks
	// ============================================
	randomFileSortStore.subscribe((value) => {
		randomSortCache = value;
	});

	favoritesStore.store.subscribe((value) => {
		favoritesCache = value;
	});

	fileContentStore.subscribe((value) => {
		contentCache = value;
	});

	fileStore.subscribe((value) => {
		loadedFiles = value;
	});

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
		viewOrder = settings.viewOrder;

		if (settings.enableClockUpdates) {
			setTimeValuesUpdateInterval();
		}

		favoritesStore.load(app, settings);
		fileStore.load(app);
		fileContentStore.load(app);
		randomFileSortStore.load(app);
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
			PluginEvent.FILTER_TOGGLE_SETTING_CHANGE,
			handleFilterToggleSettingChange,
		);

		return () => {
			EventManager.getInstance().off(
				PluginEvent.FILTER_TOGGLE_SETTING_CHANGE,
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
			PluginEvent.CLOCK_UPDATES_SETTING_CHANGE,
			handleClockUpdatesSettingChange,
		);

		return () => {
			if (timeValuesUpdateInterval != null)
				clearInterval(timeValuesUpdateInterval);

			EventManager.getInstance().off(
				PluginEvent.CLOCK_UPDATES_SETTING_CHANGE,
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
			PluginEvent.PROPERTIES_FILTER_UPDATE,
			handlePropertiesFilterUpdate,
		);
		return () => {
			EventManager.getInstance().off(
				PluginEvent.PROPERTIES_FILTER_UPDATE,
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

		EventManager.getInstance().on(
			PluginEvent.FILE_CREATE,
			handleCreateFile,
		);
		return () => {
			EventManager.getInstance().off(
				PluginEvent.FILE_CREATE,
				handleCreateFile,
			);
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
				favoritesStore.onFileDelete(path);
			}
		};

		EventManager.getInstance().on(
			PluginEvent.FILE_DELETE,
			handleDeleteFile,
		);
		return () => {
			EventManager.getInstance().off(
				PluginEvent.FILE_DELETE,
				handleDeleteFile,
			);
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
				favoritesStore.onFileRename(oldPath, updatedFile.path);
			}
		};

		EventManager.getInstance().on(
			PluginEvent.FILE_RENAME,
			handleFileRename,
		);
		return () => {
			EventManager.getInstance().off(
				PluginEvent.FILE_RENAME,
				handleFileRename,
			);
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

		EventManager.getInstance().on(
			PluginEvent.FILE_MODIFY,
			handleFileModify,
		);
		return () => {
			EventManager.getInstance().off(
				PluginEvent.FILE_MODIFY,
				handleFileModify,
			);
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

		EventManager.getInstance().on(
			PluginEvent.METADATA_CHANGE,
			handleMetadataChange,
		);
		return () => {
			EventManager.getInstance().off(
				PluginEvent.METADATA_CHANGE,
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
			PluginEvent.VIEW_TOGGLE_SETTING_CHANGE,
			handleViewToggleSettingChange,
		);
		return () => {
			EventManager.getInstance().off(
				PluginEvent.VIEW_TOGGLE_SETTING_CHANGE,
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
			PluginEvent.PAGE_SIZE_SETTING_CHANGE,
			handlePageSizeSettingChange,
		);
		return () => {
			EventManager.getInstance().off(
				PluginEvent.PAGE_SIZE_SETTING_CHANGE,
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
			PluginEvent.PROPERTY_SETTING_CHANGE,
			handlePropertySettingChange,
		);
		return () => {
			EventManager.getInstance().off(
				PluginEvent.PROPERTY_SETTING_CHANGE,
				handlePropertySettingChange,
			);
		};
	});

	onMount(() => {
		function handleCoverImageSourceSettingChange() {
			Logger.trace({
				fileName: "app/index.svelte",
				functionName: "handleCoverImageSourceSettingChange",
				message: "called",
			});

			coverImageSourcesTime = Date.now();
		}

		EventManager.getInstance().on(
			PluginEvent.COVER_IMAGE_SOURCE_SETTING_CHANGE,
			handleCoverImageSourceSettingChange,
		);
		return () => {
			EventManager.getInstance().off(
				PluginEvent.COVER_IMAGE_SOURCE_SETTING_CHANGE,
				handleCoverImageSourceSettingChange,
			);
		};
	});

	onMount(() => {
		function handleLoadBodyTagsSettingChange() {
			Logger.trace({
				fileName: "app/index.svelte",
				functionName: "handleLoadBodyTagsSettingChange",
				message: "called",
			});

			loadBodyTagsTime = Date.now();
		}

		EventManager.getInstance().on(
			PluginEvent.LOAD_BODY_TAGS_SETTING_CHANGE,
			handleLoadBodyTagsSettingChange,
		);
		return () => {
			EventManager.getInstance().off(
				PluginEvent.LOAD_BODY_TAGS_SETTING_CHANGE,
				handleLoadBodyTagsSettingChange,
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

	function handleReshuffleClick() {
		randomFileSortStore.load(plugin.app);
	}

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
		plugin.settings.currentView = currentView;
		plugin.settings.filters.custom = customFilter;
		plugin.settings.viewOrder = viewOrder;
		await plugin.saveSettings();
	}

	//TODO refactor
	async function handleGroupContextMenu(e: CustomEvent) {
		const { id } = e.detail;
		plugin.settings.filters.custom.selectedGroupId = id;
		await plugin.saveSettings();
		new CustomFilterModal(plugin).open();
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

	function handleFavoritePropertyChange(e: CustomEvent) {
		const { filePath, value } = e.detail as {
			filePath: string;
			value: boolean;
		};

		const { properties } = plugin.settings;
		const { favorite: favoritePropertyName } = properties;

		//If the favorite property is not set, return
		if (favoritePropertyName === "") {
			new Notice(
				"Please select a favorite property in the Vault Explorer settings to use this feature",
			);
			return;
		}

		const file = plugin.app.vault.getFileByPath(filePath);
		if (!file) {
			Logger.error({
				fileName: "app/index.svelte",
				functionName: "handleFavoritePropertyChange",
				message: "file not found. returning...",
			});
			return;
		}

		if (file.extension === "md") {
			plugin.app.fileManager.processFrontMatter(file, (frontmatter) => {
				frontmatter[favoritePropertyName] = value;
				return frontmatter;
			});
		} else {
			favoritesStore.setFavorite(filePath, value);
		}
	}

	function handleCustomFilterClick() {
		new CustomFilterModal(plugin).open();
	}

	// ============================================
	// Reactive statements and computed data
	// ============================================
	let filteredCustom: LoadedFile[] = [];

	$: if (frontmatterCacheTime && customFilter.groups) {
		Logger.debug(`Frontmatter cache time: ${frontmatterCacheTime}`);
		filteredCustom = loadedFiles.filter((loadedFile) => {
			const { file } = loadedFile;
			const { name, path } = file;

			const frontmatter =
				plugin.app.metadataCache.getFileCache(file)?.frontmatter;

			const content = contentCache.get(path) ?? null;

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
	$: if (propertySettingsTime || coverImageSourcesTime || loadBodyTagsTime) {
		formatted = filteredCustom.map((loadedFile) => {
			const { id, file } = loadedFile;
			const frontmatter =
				plugin.app.metadataCache.getFileCache(file)?.frontmatter;

			const isFavorite = favoritesCache.get(file.path) ?? null;

			const content = contentCache.get(file.path) ?? null;

			return formatFileDataForRender({
				app: plugin.app,
				settings: plugin.settings,
				fileId: id,
				file,
				fileFrontmatter: frontmatter,
				fileContent: content,
				fileFavorite: isFavorite,
			});
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
			const sortKeyA = randomSortCache.get(a.path) ?? 0;
			const sortKeyB = randomSortCache.get(b.path) ?? 0;
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
						{#if sortFilter.value == "random"}
							<IconButton
								iconId="shuffle"
								ariaLabel="Reshuffle files"
								on:click={handleReshuffleClick}
							/>
						{/if}
						<IconButton
							ariaLabel="Change custom filter"
							iconId="list-filter"
							on:click={handleCustomFilterClick}
						/>
					</Flex>
				</Stack>
			</Flex>
			{#if customFilter.isEnabled}
				<FilterGroupList
					groups={customFilter.groups}
					on:groupClick={handleGroupClick}
					on:groupContextMenu={handleGroupContextMenu}
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
			<GridView
				data={renderData}
				{startIndex}
				{pageLength}
				on:favoritePropertyChange={handleFavoritePropertyChange}
			/>
		{:else if currentView === "list"}
			<ListView
				data={renderData}
				{startIndex}
				{pageLength}
				on:favoritePropertyChange={handleFavoritePropertyChange}
			/>
		{:else if currentView === "table"}
			<TableView
				data={renderData}
				{startIndex}
				{pageLength}
				on:favoritePropertyChange={handleFavoritePropertyChange}
			/>
		{:else if currentView === "feed"}
			<FeedView
				data={renderData}
				{startIndex}
				{pageLength}
				on:favoritePropertyChange={handleFavoritePropertyChange}
			/>
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
