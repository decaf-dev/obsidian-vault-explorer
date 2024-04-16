import { Menu, moment, TFile, TFolder } from "obsidian";

import React from "react";

import { useAppMount } from "./app-mount-provider";
import Checkbox from "./checkbox";
import Flex from "./flex";
import Stack from "./stack";
import GridView from "./grid-view";
import ListView from "./list-view";
import Tab from "./tab";
import TabList from "./tab-list";
import IconButton from "./icon-button";

import EventManager from "src/event/event-manager";
import { MarkdownFileData } from "./types";
import { CurrentView, SortFilter, TimestampFilter } from "src/types";

import "./styles.css";

export default function ReactApp() {
	const [folderPath, setFolderPath] = React.useState<string>("");
	const [search, setSearch] = React.useState<string>("");
	const [onlyFavorites, setOnlyFavorites] = React.useState<boolean>(false);
	const [timestampFilter, setTimestampFilter] =
		React.useState<TimestampFilter>("all");
	const [view, setView] = React.useState<CurrentView>("grid");
	const [sortFilter, setSortFilter] =
		React.useState<SortFilter>("file-name-asc");
	const { app, settings, onSettingsChange } = useAppMount();

	React.useLayoutEffect(() => {
		setFolderPath(settings.filters.folder);
		setSearch(settings.filters.search);
		setOnlyFavorites(settings.filters.onlyFavorites);
		setView(settings.currentView);
	}, []);

	const [, setRefreshTime] = React.useState(0);

	//TODO optimize
	React.useEffect(() => {
		const handleRenameFile = (oldPath: string, newPath: string) => {
			setRefreshTime(Date.now());
		};

		EventManager.getInstance().on("rename-file", handleRenameFile);
		return () => {
			EventManager.getInstance().off("rename-file", handleRenameFile);
		};
	}, []);

	//TODO optimize
	React.useEffect(() => {
		const handleCreateFile = (oldPath: string, newPath: string) => {
			setRefreshTime(Date.now());
		};

		EventManager.getInstance().on("create-file", handleCreateFile);
		return () => {
			EventManager.getInstance().off("create-file", handleCreateFile);
		};
	}, []);

	//TODO optimize
	React.useEffect(() => {
		const handleDeleteFile = (oldPath: string, newPath: string) => {
			setRefreshTime(Date.now());
		};

		EventManager.getInstance().on("delete-file", handleDeleteFile);
		return () => {
			EventManager.getInstance().off("delete-file", handleDeleteFile);
		};
	}, []);

	//TODO optimize
	//TODO should we use handle frontmatter change?
	React.useEffect(() => {
		const handleModifyFile = (oldPath: string, newPath: string) => {
			setRefreshTime(Date.now());
		};

		EventManager.getInstance().on("modify-file", handleModifyFile);
		return () => {
			EventManager.getInstance().off("modify-file", handleModifyFile);
		};
	}, []);

	React.useEffect(() => {
		onSettingsChange({
			...settings,
			filters: {
				folder: folderPath,
				search,
				onlyFavorites,
				timestamp: timestampFilter,
				sort: sortFilter,
			},
			currentView: view,
		});
	}, [
		onSettingsChange,
		sortFilter,
		folderPath,
		search,
		onlyFavorites,
		timestampFilter,
		view,
	]);

	function openSortMenu(e: React.MouseEvent) {
		const menu = new Menu();
		menu.setUseNativeMenu(true);
		menu.addItem((item) => {
			item.setTitle("File name (A-Z)");
			item.setChecked(sortFilter === "file-name-asc");
			item.onClick(() => setSortFilter("file-name-asc"));
		});
		menu.addItem((item) => {
			item.setTitle("File name (Z-A)");
			item.setChecked(sortFilter === "file-name-desc");
			item.onClick(() => setSortFilter("file-name-desc"));
		});
		menu.addSeparator();
		menu.addItem((item) => {
			item.setTitle("Modified time (new to old)");
			item.setChecked(sortFilter === "modified-desc");
			item.onClick(() => setSortFilter("modified-desc"));
		});
		menu.addItem((item) => {
			item.setTitle("Modified time (old to new)");
			item.setChecked(sortFilter === "modified-asc");
			item.onClick(() => setSortFilter("modified-asc"));
		});
		menu.showAtMouseEvent(e.nativeEvent);
	}

	function openListFilterMenu(e: React.MouseEvent) {
		const menu = new Menu();
		menu.setUseNativeMenu(true);
		menu.addItem((item) => {
			item.setTitle("Modified today");
			item.setChecked(timestampFilter === "modified-today");
			item.onClick(() => setTimestampFilter("modified-today"));
		});
		menu.addItem((item) => {
			item.setTitle("Created today");
			item.setChecked(timestampFilter === "created-today");
			item.onClick(() => setTimestampFilter("created-today"));
		});
		menu.addSeparator();
		menu.addItem((item) => {
			item.setTitle("Modifed this week");
			item.setChecked(timestampFilter === "modified-this-week");
			item.onClick(() => setTimestampFilter("modified-this-week"));
		});
		menu.addItem((item) => {
			item.setTitle("Created this week");
			item.setChecked(timestampFilter === "created-this-week");
			item.onClick(() => setTimestampFilter("created-this-week"));
		});
		menu.addSeparator();
		menu.addItem((item) => {
			item.setTitle("Modifed 2 weeks");
			item.setChecked(timestampFilter === "modified-2-weeks");
			item.onClick(() => setTimestampFilter("modified-2-weeks"));
		});
		menu.addItem((item) => {
			item.setTitle("Created 2 weeks");
			item.setChecked(timestampFilter === "created-2-weeks");
			item.onClick(() => setTimestampFilter("created-2-weeks"));
		});

		menu.showAtMouseEvent(e.nativeEvent);
	}

	const {
		favoritePropertyName,
		urlPropertyName,
		sourcePropertyName,
		revisionPropertyName,
		statusPropertyName,
	} = settings;

	const folders = app.vault
		.getAllLoadedFiles()
		.filter((file) => file instanceof TFolder)
		.map((folder) => folder.path);

	const folderFiles = app.vault
		.getMarkdownFiles()
		.filter((file) => file instanceof TFile)
		.filter((file) => {
			if (folderPath === "") {
				return true;
			} else if (folderPath === "/") {
				return true;
			}
			return file.path.startsWith(folderPath ?? "/");
		});

	const sortedMarkdownFiles = [...app.vault.getMarkdownFiles()].sort(
		(a, b) => {
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
		}
	);

	const filteredData: MarkdownFileData[] = sortedMarkdownFiles
		// .filter((file) => {
		// 	if (onlyModifiedToday) {
		// 		const midnightToday = moment().startOf("day").valueOf();
		// 		return file.stat.mtime > midnightToday;
		// 	}
		// 	return true;
		// })
		// .filter((file) => {
		// 	if (onlyCreatedToday) {
		// 		const midnightToday = moment().startOf("day").valueOf();
		// 		return file.stat.ctime > midnightToday;
		// 	}
		// 	return true;
		// })
		.map((file) => {
			const frontmatter = app.metadataCache.getFileCache(
				file as TFile
			)?.frontmatter;

			let tags: string[] = [];
			//Tags can be an array or just a string
			//This seems like a bug in Obsidian
			if (typeof frontmatter?.tags === "string") {
				tags = [frontmatter?.tags as string];
			} else if (Array.isArray(frontmatter?.tags)) {
				tags = frontmatter?.tags as string[];
			}

			const url: string | null = frontmatter?.[urlPropertyName] ?? null;
			const favorite = frontmatter?.[favoritePropertyName] ?? false;
			const source = frontmatter?.[sourcePropertyName] ?? null;
			const revision = frontmatter?.[revisionPropertyName] ?? null;
			const status = frontmatter?.[statusPropertyName] ?? null;

			return {
				name: file.basename,
				path: file.path,
				tags,
				source,
				favorite,
				url,
				revision,
				status,
			};
		})
		.filter((file) => {
			if (folderPath === "/") {
				return true;
			} else if (folderPath) {
				return file.path.startsWith(folderPath);
			}
			return false;
		})
		.filter((file) => {
			if (file.name.toLowerCase().includes(search.toLowerCase())) {
				return true;
			} else if (
				file.tags.some((tag) =>
					tag.toLowerCase().includes(search.toLowerCase())
				)
			) {
				return true;
			} else if (file.path.toLowerCase().includes(search.toLowerCase())) {
				return true;
			} else if (
				file.source &&
				file.source.toLowerCase().includes(search.toLowerCase())
			) {
				return true;
			} else if (
				file.revision &&
				file.revision.toLowerCase().includes(search.toLowerCase())
			) {
				return true;
			} else if (
				file.status &&
				file.status.toLowerCase().includes(search.toLowerCase())
			) {
				return true;
			}
			return false;
		})
		.filter((file) => {
			if (onlyFavorites) {
				return file.favorite;
			}
			return true;
		});

	return (
		<div className="vault-explorer">
			<div className="vault-explorer-header">
				<Stack spacing="md">
					<input
						type="text"
						placeholder="Search..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
					<select
						value={folderPath}
						onChange={(e) => setFolderPath(e.target.value)}
					>
						<option value="">Select a folder</option>
						{folders.map((folder) => (
							<option key={folder} value={folder}>
								{folder}
							</option>
						))}
					</select>
				</Stack>
				<Flex justify="space-between">
					<Stack spacing="md">
						<Checkbox
							id="favorites"
							label="Favorites"
							value={onlyFavorites}
							onChange={setOnlyFavorites}
						/>
						<IconButton
							iconId="list-filter"
							onClick={openListFilterMenu}
						/>
						<IconButton
							iconId="arrow-up-narrow-wide"
							onClick={openSortMenu}
						/>
					</Stack>
					<div>
						Showing {filteredData.length} out of{" "}
						{folderFiles.length}
					</div>
				</Flex>
				<Stack spacing="sm">
					<TabList>
						<Tab onClick={() => setView("grid")}>Grid</Tab>
						<Tab onClick={() => setView("list")}>List</Tab>
					</TabList>
				</Stack>
			</div>
			{view === "grid" && <GridView data={filteredData} />}
			{view === "list" && <ListView data={filteredData} />}
		</div>
	);
}
