import { moment, TFile, TFolder } from "obsidian";

import React from "react";
import Card from "./card";

import "./styles.css";
import { useAppMount } from "./app-mount-provider";
import Checkbox from "./checkbox";
import Flex from "./flex";
import Stack from "./stack";

export default function ReactView() {
	const [folderPath, setFolderPath] = React.useState<string>("");
	const [search, setSearch] = React.useState<string>("");
	const [onlyFavorites, setOnlyFavorites] = React.useState<boolean>(false);
	const [onlyModifiedToday, setOnlyModifiedToday] =
		React.useState<boolean>(false);
	const [onlyCreatedToday, setOnlyCreatedToday] =
		React.useState<boolean>(false);
	const { app, settings, onSettingsChange } = useAppMount();

	React.useEffect(() => {
		setFolderPath(settings.filters.folder);
		setSearch(settings.filters.search);
		setOnlyFavorites(settings.filters.onlyFavorites);
		setOnlyModifiedToday(settings.filters.onlyModifiedToday);
		setOnlyCreatedToday(settings.filters.onlyCreatedToday);
	}, []);

	React.useEffect(() => {
		onSettingsChange({
			...settings,
			filters: {
				folder: folderPath,
				search,
				onlyFavorites,
				onlyModifiedToday,
				onlyCreatedToday,
			},
		});
	}, [
		onSettingsChange,
		folderPath,
		search,
		onlyFavorites,
		onlyModifiedToday,
		onlyCreatedToday,
	]);

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

	const filteredData = app.vault
		.getMarkdownFiles()
		.filter((file) => file instanceof TFile)
		.filter((file) => {
			if (onlyModifiedToday) {
				const midnightToday = moment().startOf("day").valueOf();
				return file.stat.mtime > midnightToday;
			}
			return true;
		})
		.filter((file) => {
			if (onlyCreatedToday) {
				const midnightToday = moment().startOf("day").valueOf();
				return file.stat.ctime > midnightToday;
			}
			return true;
		})
		.map((file) => {
			const frontmatter = app.metadataCache.getFileCache(
				file as TFile
			)?.frontmatter;
			const tags: string[] = frontmatter?.tags ?? [];
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
						<Checkbox
							id="modified-today"
							label="Modified today"
							value={onlyModifiedToday}
							onChange={setOnlyModifiedToday}
						/>
						<Checkbox
							id="created-today"
							label="Created today"
							value={onlyCreatedToday}
							onChange={setOnlyCreatedToday}
						/>
					</Stack>
					<div>
						Showing {filteredData.length} out of{" "}
						{folderFiles.length}
					</div>
				</Flex>
			</div>
			<div className="vault-explorer-list">
				{filteredData.map((file) => {
					const { name, tags, path, url, source, revision, status } =
						file;
					return (
						<Card
							key={path}
							name={name}
							path={path}
							url={url}
							tags={tags}
							source={source}
							revision={revision}
							status={status}
						/>
					);
				})}
				{/* <Virtuoso
					style={{ height: 400 }}
					data={data}
					itemContent={(index, file) => <Card name={file} />}
				/> */}
			</div>
		</div>
	);
}
