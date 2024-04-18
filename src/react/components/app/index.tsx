export {};

// import { Menu, TFile, TFolder } from "obsidian";

// import React from "react";

// import { useAppMount } from "../shared/app-mount-provider";
// import Checkbox from "../shared/checkbox";
// import Flex from "../shared/flex";
// import Stack from "../shared/stack";
// import GridView from "./grid-view";
// import ListView from "./list-view";
// import Tab from "../shared/tab";
// import TabList from "../shared/tab-list";
// import IconButton from "../shared/icon-button";

// import EventManager from "src/event/event-manager";
// import { MarkdownFileRenderData } from "./types";
// import { CurrentView, SortFilter, TimestampFilter } from "src/types";

// import PropertiesFilterModal from "src/obsidian/properties-filter-modal";

// import "./styles.css";
// import { filterByTimestamp } from "./services/filters/timestamp-filter";
// import { filterByProperty } from "./services/filters/property-filter";
// import { filterByFolder } from "./services/filters/folder-filter";
// import { favoriteFilter as filterByFavorite } from "./services/filters/favorite-filter";
// import { filterBySearch } from "./services/filters/search-filter";
// import { formatFileDataForRender } from "./services/render-utils";
// import {
// 	getMidnightLastWeek,
// 	getMidnightThisWeek,
// 	getMidnightToday,
// } from "./services/time-utils";

// const midnightToday = getMidnightToday();
// const midnightThisWeek = getMidnightThisWeek();
// const midnightLastWeek = getMidnightLastWeek();

// export default function ReactApp() {
// 	const [folderPath, setFolderPath] = React.useState<string>("/");
// 	const [searchFilter, setSearch] = React.useState<string>("");
// 	const [onlyFavorites, setOnlyFavorites] = React.useState<boolean>(false);
// 	const [timestampFilter, setTimestampFilter] =
// 		React.useState<TimestampFilter>("all");
// 	const [currentView, setCurrentView] = React.useState<CurrentView>("grid");
// 	const [sortFilter, setSortFilter] =
// 		React.useState<SortFilter>("file-name-asc");

// 	const { app, getCurrentSettings, onSettingsChange } = useAppMount();
// 	const settings = getCurrentSettings();

// 	React.useLayoutEffect(() => {
// 		setFolderPath(settings.filters.folder);
// 		setSearch(settings.filters.search);
// 		setOnlyFavorites(settings.filters.onlyFavorites);
// 		setCurrentView(settings.currentView);
// 		setTimestampFilter(settings.filters.timestamp);
// 		setSortFilter(settings.filters.sort);
// 	}, []);

// 	const [refreshTime, setRefreshTime] = React.useState(0);

// 	//TODO optimize
// 	React.useEffect(() => {
// 		const handlePropertiesFilterUpdate = () => {
// 			setRefreshTime(Date.now());
// 		};

// 		EventManager.getInstance().on(
// 			"properties-filter-update",
// 			handlePropertiesFilterUpdate
// 		);

// 		return () => {
// 			EventManager.getInstance().emit("properties-filter-update");
// 		};
// 	}, []);

// 	//TODO optimize
// 	React.useEffect(() => {
// 		const handleRenameFile = (oldPath: string, newPath: string) => {
// 			setRefreshTime(Date.now());
// 		};

// 		EventManager.getInstance().on("rename-file", handleRenameFile);
// 		return () => {
// 			EventManager.getInstance().off("rename-file", handleRenameFile);
// 		};
// 	}, []);

// 	//TODO optimize
// 	React.useEffect(() => {
// 		const handleCreateFile = (oldPath: string, newPath: string) => {
// 			setRefreshTime(Date.now());
// 		};

// 		EventManager.getInstance().on("create-file", handleCreateFile);
// 		return () => {
// 			EventManager.getInstance().off("create-file", handleCreateFile);
// 		};
// 	}, []);

// 	//TODO optimize
// 	React.useEffect(() => {
// 		const handleDeleteFile = (oldPath: string, newPath: string) => {
// 			setRefreshTime(Date.now());
// 		};

// 		EventManager.getInstance().on("delete-file", handleDeleteFile);
// 		return () => {
// 			EventManager.getInstance().off("delete-file", handleDeleteFile);
// 		};
// 	}, []);

// 	//TODO optimize
// 	React.useEffect(() => {
// 		const handleModifyFile = (oldPath: string, newPath: string) => {
// 			setRefreshTime(Date.now());
// 		};

// 		EventManager.getInstance().on("modify-file", handleModifyFile);
// 		return () => {
// 			EventManager.getInstance().off("modify-file", handleModifyFile);
// 		};
// 	}, []);

// 	//TODO optimize
// 	React.useEffect(() => {
// 		const handleMetadataChange = (filePath: string) => {
// 			setRefreshTime(Date.now());
// 		};

// 		EventManager.getInstance().on("metadata-change", handleMetadataChange);
// 		return () => {
// 			EventManager.getInstance().off(
// 				"metadata-change",
// 				handleMetadataChange
// 			);
// 		};
// 	}, []);

// 	React.useEffect(() => {
// 		onSettingsChange({
// 			...settings,
// 			filters: {
// 				folder: folderPath,
// 				search: searchFilter,
// 				onlyFavorites,
// 				timestamp: timestampFilter,
// 				sort: sortFilter,
// 				properties: { ...settings.filters.properties },
// 			},
// 			currentView: currentView,
// 		});
// 	}, [
// 		onSettingsChange,
// 		sortFilter,
// 		folderPath,
// 		searchFilter,
// 		onlyFavorites,
// 		timestampFilter,
// 		currentView,
// 	]);

// 	//TODO update for folder
// 	const allFiles = React.useMemo(() => {
// 		return app.vault.getAllLoadedFiles();
// 	}, [refreshTime]);

// 	const folders = allFiles
// 		.filter((file) => file instanceof TFolder)
// 		.map((folder) => folder.path);

// 	const folderFiles = app.vault
// 		.getMarkdownFiles()
// 		.filter((file) => file instanceof TFile)
// 		.filter((file) => {
// 			if (folderPath === "") {
// 				return true;
// 			} else if (folderPath === "/") {
// 				return true;
// 			}
// 			return file.path.startsWith(folderPath ?? "/");
// 		});

const sortedMarkdownFiles = React.useMemo(
	() =>
		[...app.vault.getMarkdownFiles()].sort((a, b) => {
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
		}),
	[refreshTime]
);

let filteredData: TFile[] = sortedMarkdownFiles;
//TODO update every minute
filteredData = filteredData.filter((file) =>
	filterByTimestamp(file, timestampFilter, {
		midnightToday,
		midnightThisWeek,
		midnightLastWeek,
	})
);
filteredData = filteredData.filter((file) =>
	filterByProperty(app, file, settings.filters.properties.groups)
);
filteredData = filteredData.filter((file) => filterByFolder(file, folderPath));

let renderData = filteredData.map((file) =>
	formatFileDataForRender(app, settings, file)
);
renderData = renderData.filter((file) => filterBySearch(file, searchFilter));
renderData = renderData.filter((file) => filterByFavorite(file, onlyFavorites));

// 	return (
// 		<div className="vault-explorer">
// 			<div className="vault-explorer-header">
// 				<Stack spacing="md">
// 					<input
// 						type="text"
// 						placeholder="Search..."
// 						value={searchFilter}
// 						onChange={(e) => setSearch(e.target.value)}
// 					/>
// 				</Stack>
// 				<Flex justify="space-between">
// 					<Stack spacing="sm">
// 						<Checkbox
// 							id="favorites"
// 							label="Favorites"
// 							value={onlyFavorites}
// 							onChange={setOnlyFavorites}
// 						/>
// 						<Flex>
// 							<IconButton
// 								ariaLabel="Change folder filter"
// 								iconId="folder"
// 								onClick={openFolderFilterMenu}
// 							/>
// 							<IconButton
// 								ariaLabel="Change timestamp filter"
// 								iconId="clock"
// 								onClick={openListFilterMenu}
// 							/>
// 							<IconButton
// 								ariaLabel="Change properties filter"
// 								iconId="sliders-horizontal"
// 								onClick={openPropertiesFilterModal}
// 							/>
// 							<IconButton
// 								ariaLabel="Change sort order"
// 								iconId="arrow-up-narrow-wide"
// 								onClick={openSortMenu}
// 							/>
// 						</Flex>
// 					</Stack>
// 					<div>
// 						Showing {renderData.length} out of {folderFiles.length}
// 					</div>
// 				</Flex>
// 				<Stack spacing="sm">
// 					<TabList>
// 						<Tab onClick={() => setCurrentView("grid")}>Grid</Tab>
// 						<Tab onClick={() => setCurrentView("list")}>List</Tab>
// 					</TabList>
// 				</Stack>
// 			</div>
// 			{currentView === "grid" && <GridView data={renderData} />}
// 			{currentView === "list" && <ListView data={renderData} />}
// 		</div>
// 	);
// }
