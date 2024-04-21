<script lang="ts">
	import Stack from "../shared/components/stack.svelte";
	import Flex from "../shared/components/flex.svelte";
	import IconButton from "../shared/components/icon-button.svelte";
	import Checkbox from "../shared/components/checkbox.svelte";
	import TabList from "../shared/components/tab-list.svelte";
	import Tab from "../shared/components/tab.svelte";
	import { FrontMatterCache, Menu, TFile, TFolder } from "obsidian";
	import PropertiesFilterModal from "src/obsidian/properties-filter-modal";
	import { CurrentView, SortFilter, TimestampFilter } from "src/types";
	import store from "../shared/services/store";
	import VaultExplorerPlugin from "src/main";
	import GridView from "./components/grid-view.svelte";
	import ListView from "./components/list-view.svelte";
	import { filterByFavorites } from "./services/filters/favorite-filter";
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
	import _ from "lodash";
	import { onMount } from "svelte";
	import EventManager from "src/event/event-manager";

	let plugin: VaultExplorerPlugin;

	let midnightToday: number;
	let midnightThisWeek: number;
	let midnightLastWeek: number;

	function updateTimeValues() {
		midnightToday = getMidnightToday();
		midnightThisWeek = getMidnightThisWeek();
		midnightLastWeek = getMidnightLastWeek();
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
	let folderFilter: string = "/";
	let sortFilter: SortFilter = "file-name-asc";
	let timestampFilter: TimestampFilter = "all";
	let onlyFavorites: boolean = false;
	let currentView: CurrentView = "grid";

	let frontmatterCache: Record<string, FrontMatterCache | undefined> = {};

	let markdownFiles: TFile[] = [];

	const debounceSearchFilter = _.debounce((e) => {
		searchFilter = e.target.value;
	}, 300);

	const debounceFavoriteFilter = _.debounce((value) => {
		onlyFavorites = value;
	}, 300);

	store.plugin.subscribe((p) => {
		plugin = p;

		const allFiles = plugin.app.vault.getAllLoadedFiles();
		folders = allFiles
			.filter((file) => file instanceof TFolder)
			.map((folder) => folder.path);

		markdownFiles = plugin.app.vault.getMarkdownFiles();
		pageSize = plugin.settings.pageSize;

		let localCache: Record<string, FrontMatterCache | undefined> = {};
		markdownFiles.forEach((file) => {
			const frontmatter =
				plugin.app.metadataCache.getFileCache(file)?.frontmatter;

			localCache[file.path] = frontmatter;
		});

		frontmatterCache = localCache;

		searchFilter = plugin.settings.filters.search;
		folderFilter = plugin.settings.filters.folder;
		sortFilter = plugin.settings.filters.sort;
		timestampFilter = plugin.settings.filters.timestamp;
		onlyFavorites = plugin.settings.filters.onlyFavorites;
		currentView = plugin.settings.currentView;
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
		const handleFolderCreate = (...data: unknown[]) => {
			// console.log("folder-create event triggered");
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
		const handleDeleteFolder = (...data: unknown[]) => {
			// console.log("folder-delete event triggered");
			if (data.length > 0 && typeof data[0] === "string") {
				const path = data[0] as string;
				folders = folders.filter((folder) => folder !== path);

				if (folderFilter === path) {
					folderFilter = "/";
				}
			}
		};

		EventManager.getInstance().on("folder-delete", handleDeleteFolder);
		return () => {
			EventManager.getInstance().off("folder-delete", handleDeleteFolder);
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
		const handleFolderRename = (...data: unknown[]) => {
			// console.log("folder-rename event triggered");
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

				if (folderFilter === oldPath) {
					folderFilter = updatedFolder.path;
				}
			}
		};

		EventManager.getInstance().on("folder-rename", handleFolderRename);
		return () => {
			EventManager.getInstance().off("folder-rename", handleFolderRename);
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

	$: sorted = [...markdownFiles].sort((a, b) => {
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

	$: filteredTimestamp = sorted.filter((file) =>
		filterByTimestamp(file, timestampFilter, {
			midnightToday,
			midnightThisWeek,
			midnightLastWeek,
		}),
	);

	$: filteredProperty = filteredTimestamp.filter((file) => {
		const frontmatter = frontmatterCache[file.path];
		return filterByProperty(
			frontmatter,
			plugin.settings.filters.properties.groups,
		);
	});

	$: filteredFolder = filteredProperty.filter((file) =>
		filterByFolder(file, folderFilter),
	);

	$: formatted = filteredFolder.map((file) => {
		const frontmatter = frontmatterCache[file.path];
		return formatFileDataForRender(plugin.settings, file, frontmatter);
	});

	$: filterSearch = formatted.filter((file) =>
		filterBySearch(file, searchFilter),
	);

	$: renderData = filterSearch.filter((file) =>
		filterByFavorites(file, onlyFavorites),
	);

	$: searchFilter,
		folderFilter,
		sortFilter,
		timestampFilter,
		onlyFavorites,
		currentView,
		saveSettings();

	async function saveSettings() {
		plugin.settings.filters.search = searchFilter;
		plugin.settings.filters.folder = folderFilter;
		plugin.settings.filters.sort = sortFilter;
		plugin.settings.filters.timestamp = timestampFilter;
		plugin.settings.filters.onlyFavorites = onlyFavorites;
		plugin.settings.currentView = currentView;
		await plugin.saveSettings();
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

	function openFolderFilterMenu(e: CustomEvent) {
		const nativeEvent = e.detail.nativeEvent as MouseEvent;

		const menu = new Menu();
		menu.setUseNativeMenu(true);

		for (const folder of folders) {
			menu.addItem((item) => {
				item.setTitle(folder === "/" ? "All" : folder);
				item.setChecked(folderFilter === folder);
				item.onClick(() => (folderFilter = folder));
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
			<input
				type="text"
				placeholder="Search..."
				value={searchFilter}
				on:input={debounceSearchFilter}
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
		<Stack spacing="sm">
			<TabList initialSelectedIndex={currentView === "grid" ? 0 : 1}>
				<Tab on:click={() => (currentView = "grid")}>Grid</Tab>
				<Tab on:click={() => (currentView = "list")}>List</Tab>
			</TabList>
		</Stack>
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
		max-width: 300px;
	}
</style>
