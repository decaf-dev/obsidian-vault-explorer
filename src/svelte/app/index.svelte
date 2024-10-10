<script lang="ts">
	// ============================================
	// Imports
	// ============================================
	import Stack from "../shared/components/stack.svelte";
	import Flex from "../shared/components/flex.svelte";
	import TabList from "../shared/components/tab-list.svelte";
	import Tab from "../shared/components/tab.svelte";
	import { TFile } from "obsidian";
	import {
		TCustomFilter,
		TSearchFilter,
		TSortFilter,
		TExplorerView,
		CoverImageFit,
		TGridView,
		TFeedView,
		TTableView,
		TListView,
	} from "src/types";
	import store from "../shared/services/store";
	import VaultExplorerPlugin from "src/main";
	import GridView from "./components/grid-view.svelte";
	import ListView from "./components/list-view.svelte";
	import { filterBySearch } from "./services/filters/search-filter";
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
	import SortFilter from "./components/sort-filter.svelte";
	import { DEBOUNCE_INPUT_TIME, SCREEN_SIZE_MD } from "./constants";
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
	import Spacer from "../shared/components/spacer.svelte";
	import License from "../shared/services/license";

	// ============================================
	// Variables
	// ============================================
	let plugin: VaultExplorerPlugin;
	let ref: HTMLElement | null = null;

	let startOfTodayMillis: number = -1;
	let startOfThisWeekMillis: number = -1;
	let startOfLastWeekMillis: number = -1;

	let shouldCollapseFilters: boolean = false;

	let pageSize: number = 0;
	let searchFilter: TSearchFilter = {
		isEnabled: false,
		value: "",
	};

	let sortFilter: TSortFilter = {
		isEnabled: false,
		value: "file-name-asc",
	};

	let customFilter: TCustomFilter = {
		isEnabled: false,
		selectedGroupId: "",
		groups: [],
	};

	let currentView: TExplorerView | null = null;

	let frontmatterCacheTime: number = Date.now();
	let propertySettingsTime: number = Date.now();
	let coverImageSourcesTime: number = Date.now();
	let coverImageFitTime: number = Date.now();
	let loadBodyTagsTime: number = Date.now();

	let loadedFiles: LoadedFile[] = [];
	let timeValuesUpdateInterval: NodeJS.Timer | null = null;

	let favoritesCache: TFavoritesCache = new Map();
	let contentCache: FileContentCache = new Map();
	let randomSortCache: RandomFileSortCache = new Map();

	let isSmallScreenSize: boolean = false;
	let enablePremiumFeatures: boolean = false;

	//Views
	let gridView: TGridView = {
		isEnabled: true,
		order: 0,
		coverImageSources: [],
		coverImageFit: "contain",
		loadSocialMediaImage: false,
	};

	let listView: TListView = {
		showTags: false,
		isEnabled: true,
		order: 1,
	};

	let feedView: TFeedView = {
		isEnabled: true,
		order: 2,
		collapseStyle: "no-new-lines",
		removeH1: true,
		lineClampSmall: 2,
		lineClampMedium: 3,
		lineClampLarge: 5,
	};

	let tableView: TTableView = {
		isEnabled: true,
		order: 3,
	};

	let initialRender = true;

	// Embedded settings
	export let embedSettings: Record<string, any> = {};

	let embedded = embedSettings?.embedded ?? false;
	let embeddedGroup = embedSettings?.group ?? null;
	let embeddedView = embedSettings?.view ?? null;


	// ============================================
	// Lifecycle hooks
	// ============================================

	onMount(() => {
		initialRender = false;
	});

	License.getInstance()
		.getHasValidKeyStore()
		.subscribe((hasValidKey) => {
			enablePremiumFeatures = hasValidKey;
		});

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

	store.plugin.subscribe((p) => {
		plugin = p;

		const { app, settings } = plugin;
		shouldCollapseFilters = settings.shouldCollapseFilters;
		pageSize = settings.pageSize;
		searchFilter = settings.filters.search;
		sortFilter = settings.filters.sort;
		currentView = settings.currentView;
		customFilter = settings.filters.custom;
		gridView = settings.views.grid;
		listView = settings.views.list;
		tableView = settings.views.table;
		feedView = settings.views.feed;

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
			sortFilter = plugin.settings.filters.sort;
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
		function handleToggleFiltersChange() {
			shouldCollapseFilters = !shouldCollapseFilters;
		}

		EventManager.getInstance().on(
			PluginEvent.COLLAPSE_FILTERS_CHANGE,
			handleToggleFiltersChange,
		);
		return () => {
			EventManager.getInstance().off(
				PluginEvent.COLLAPSE_FILTERS_CHANGE,
				handleToggleFiltersChange,
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

			currentView = plugin.settings.currentView;
			gridView = plugin.settings.views.grid;
			listView = plugin.settings.views.list;
			tableView = plugin.settings.views.table;
			feedView = plugin.settings.views.feed;
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
		function handleCoverImageFitSettingChange() {
			Logger.trace({
				fileName: "app/index.svelte",
				functionName: "handleCoverImageFitSettingChange",
				message: "called",
			});

			coverImageFitTime = Date.now();
		}

		EventManager.getInstance().on(
			PluginEvent.COVER_IMAGE_FIT_SETTING_CHANGE,
			handleCoverImageFitSettingChange,
		);
		return () => {
			EventManager.getInstance().off(
				PluginEvent.COVER_IMAGE_FIT_SETTING_CHANGE,
				handleCoverImageFitSettingChange,
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
		let resizeObserver: ResizeObserver;

		function checkLeafWidth(leafEl: HTMLElement) {
			const { clientWidth } = leafEl;
			if (clientWidth < SCREEN_SIZE_MD) {
				isSmallScreenSize = true;
			} else {
				isSmallScreenSize = false;
			}
		}

		const leafEl = ref?.closest(
			".workspace-leaf-content",
		) as HTMLElement | null;
		if (leafEl) {
			checkLeafWidth(leafEl);

			resizeObserver = new ResizeObserver(() => {
				checkLeafWidth(leafEl);
			});
			resizeObserver.observe(leafEl);
		}

		return () => {
			resizeObserver?.disconnect();
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

	onMount(() => {
		if (embedded && embeddedGroup) {
			selectGroupByName(embeddedGroup);
		}
		if (embedded && embeddedView) {
			if (embeddedView === "grid") {
				currentView = TExplorerView.GRID;
			} else if (embeddedView === "list") {
				currentView = TExplorerView.LIST;
			} else if (embeddedView === "feed") {
				currentView = TExplorerView.FEED;
			} else if (embeddedView === "table") {
				currentView = TExplorerView.TABLE;
			}
		}
	});

	// ============================================
	// Functions
	// ============================================
	const debounceSearchFilterChange = _.debounce((e) => {
		searchFilter.value = e.target.value;
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
		if (initialRender) return;

		plugin.settings.filters.search = searchFilter;
		plugin.settings.filters.sort = sortFilter;
		plugin.settings.currentView = currentView;
		plugin.settings.filters.custom = customFilter;
		plugin.settings.shouldCollapseFilters = shouldCollapseFilters;
		plugin.settings.views.list = listView;
		plugin.settings.views.grid = gridView;
		plugin.settings.views.table = tableView;
		plugin.settings.views.feed = feedView;
		await plugin.saveSettings();
	}

	// Note: Multiple groups can be the same name, in which case the first group found will be selected
	function selectGroupByName(name: string) {
		const { groups } = customFilter;
		const group = groups.find((group) => group.name === name);
		if (group) {
			customFilter.selectedGroupId = group.id;
			customFilter.groups = groups.map((group) => {
				if (group.id === customFilter.selectedGroupId) {
					return { ...group, isEnabled: true };
				} else {
					return { ...group, isEnabled: false };
				}
			});
		}
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

	function handleViewDragStart(e: CustomEvent, type: TExplorerView) {
		const { nativeEvent } = e.detail;
		nativeEvent.dataTransfer.setData("text", type);
		nativeEvent.dataTransfer.effectAllowed = "move";
	}

	function handleViewDrop(e: CustomEvent, type: TExplorerView) {
		const { nativeEvent } = e.detail;
		const dragId = nativeEvent.dataTransfer.getData("text");
		nativeEvent.dataTransfer.dropEffect = "move";

		const views = {
			[TExplorerView.GRID]: gridView,
			[TExplorerView.LIST]: listView,
			[TExplorerView.FEED]: feedView,
			[TExplorerView.TABLE]: tableView,
		};

		const draggedView = Object.entries(views).find(
			([key]) => key === dragId,
		);

		const droppedView = Object.entries(views).find(([key]) => key === type);

		// Ensure both dragged and dropped views are found
		if (!draggedView || !droppedView) return;

		// Swap the order properties of the dragged and dropped views
		const tempOrder = draggedView[1].order;
		draggedView[1].order = droppedView[1].order;
		droppedView[1].order = tempOrder;

		gridView = views[TExplorerView.GRID];
		listView = views[TExplorerView.LIST];
		feedView = views[TExplorerView.FEED];
		tableView = views[TExplorerView.TABLE];
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

	function handleCoverImageFitChange(e: CustomEvent) {
		const { filePath, value } = e.detail as {
			filePath: string;
			value: CoverImageFit;
		};

		const { properties } = plugin.settings;
		const { coverImageFit: coverImageFitProperty } = properties;

		const file = plugin.app.vault.getFileByPath(filePath);
		if (!file) {
			Logger.error({
				fileName: "app/index.svelte",
				functionName: "handleCoverImageFitChange",
				message: "file not found. returning...",
			});
			return;
		}

		if (file.extension === "md") {
			plugin.app.fileManager.processFrontMatter(file, (frontmatter) => {
				frontmatter[coverImageFitProperty] = value;
				return frontmatter;
			});
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
	$: if (
		propertySettingsTime ||
		coverImageSourcesTime ||
		loadBodyTagsTime ||
		coverImageFitTime
	) {
		formatted = filteredCustom.map((loadedFile) => {
			const { id, file } = loadedFile;
			const content = contentCache.get(file.path) ?? null;

			return formatFileDataForRender({
				app: plugin.app,
				settings: plugin.settings,
				fileId: id,
				file,
				fileContent: content,
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

	$: renderData = [...filteredSearch].sort((a, b) => {
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
		} else if (value === "created-asc") {
			return a.createdMillis - b.createdMillis;
		} else if (value === "created-desc") {
			return b.createdMillis - a.createdMillis;
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
		currentView,
		customFilter,
		listView,
		gridView,
		tableView,
		feedView,
		shouldCollapseFilters,
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

	let views: Record<
		TExplorerView,
		TGridView | TListView | TFeedView | TTableView
	>;
	$: views = {
		[TExplorerView.GRID]: gridView,
		[TExplorerView.LIST]: listView,
		[TExplorerView.FEED]: feedView,
		[TExplorerView.TABLE]: tableView,
	};

	$: orderedViews = Object.entries(views)
		.filter((view) => view[1].order >= 0) // Filter out views with negative order values
		.sort((a, b) => a[1].order - b[1].order)
		.map((entry) => entry[0]) as TExplorerView[]; // Sort by order value
</script>

<div class="vault-explorer" bind:this={ref}>
	{#if shouldCollapseFilters === false && !embedded || (embedded && !embeddedGroup)}
		<div class="vault-explorer-filters">
			<Stack spacing="sm" direction="column">
				<Flex justify="space-between">
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
				</Flex>
				<div>
					<button
						class="vault-explorer-button"
						on:click={handleCustomFilterClick}>Configure</button
					>
				</div>
			</Stack>
			<Spacer size="md" />
		</div>
	{/if}
	<Wrap align="center" spacingY="sm" justify="space-between">
		<div class="vault-explorer-view-select">
			{#if currentView !== null}
				<TabList initialSelectedIndex={views[currentView].order}>
					{#each orderedViews as view}
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
			{/if}
		</div>
		<Flex>
			{#if searchFilter.isEnabled}
				<SearchFilter
					value={searchFilter.value}
					on:input={debounceSearchFilterChange}
					on:clear={() => (searchFilter.value = "")}
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
		</Flex>
	</Wrap>
	<Spacer size="md" />
	{#if currentView === "grid"}
		<GridView
			data={renderData}
			{startIndex}
			{pageLength}
			{enablePremiumFeatures}
			on:coverImageFitChange={handleCoverImageFitChange}
		/>
	{:else if currentView === "list"}
		<ListView
			data={renderData}
			{isSmallScreenSize}
			{startIndex}
			{pageLength}
			{enablePremiumFeatures}
		/>
	{:else if currentView === "table"}
		<TableView
			data={renderData}
			{startIndex}
			{pageLength}
			{enablePremiumFeatures}
		/>
	{:else if currentView === "feed"}
		<FeedView
			data={renderData}
			{startIndex}
			{pageLength}
			{enablePremiumFeatures}
		/>
	{/if}
	<PaginationIndicator
		{startIndex}
		{endIndex}
		{currentPage}
		{totalPages}
		{totalItems}
		on:change={handlePageChange}
	/>
</div>

<style>
	.vault-explorer {
		display: flex;
		flex-direction: column;
	}

	.vault-explorer-view-select {
		flex: 1;
	}

	.vault-explorer-button {
		background: none;
		text-decoration: underline;
		color: var(--text-faint);
		font-size: var(--font-small);
		border: none;
		box-shadow: none;
		padding: 0;
	}

	.vault-explorer-button:focus-visible {
		box-shadow: 0 0 0 2px var(--background-modifier-border-focus);
	}
</style>
