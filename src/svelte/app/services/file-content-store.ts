import { App, TFile } from "obsidian";
import { writable } from "svelte/store";

type FileContentStore = Record<string, string | null>;

interface FileContent {
	path: string;
	content: string | null;
}

function createFileContentStore() {
	const { subscribe, set, update } = writable<FileContentStore>({});

	async function load(app: App) {
		const promises: Promise<FileContent>[] = [];

		const files = app.vault.getMarkdownFiles();
		for (let file of files) {
			promises.push(
				(async () => {
					const { basename, extension } = file;
					if (
						extension === "md" &&
						!basename.endsWith(".excalidraw")
					) {
						const content = await app.vault.cachedRead(file);
						return {
							path: file.path,
							content,
						};
					}
					return {
						path: file.path,
						content: null,
					};
				})()
			);
		}

		const results = await Promise.all(promises);

		const contentForFiles = results.reduce(
			(acc: Record<string, string | null>, file) => {
				const { path, content } = file;
				acc[path] = content;
				return acc;
			},
			{}
		);
		set(contentForFiles);
	}

	async function handleFileCreate(app: App, file: TFile) {
		let content: string | null = null;
		if (file.extension === "md") {
			content = await app.vault.cachedRead(file);
		}

		update((files) => {
			// Create a shallow copy of the files object to ensure reactivity
			return { ...files, [file.path]: content };
		});
	}

	function handleFileRename(oldPath: string, newPath: string) {
		update((files) => {
			if (files.hasOwnProperty(oldPath)) {
				// Create a shallow copy of the files object
				const { [oldPath]: value, ...newFiles } = files;
				newFiles[newPath] = value;
				return newFiles;
			}
			// No change if the old path does not exist
			return files;
		});
	}

	function handleFileModify(path: string, newContent: string | null) {
		update((store) => {
			return {
				...store,
				[path]: newContent,
			};
		});
	}

	function handleFileDelete(path: string) {
		update((files) => {
			// Create a shallow copy and delete the property
			const { [path]: _, ...newFiles } = files;
			return newFiles;
		});
	}

	return {
		load,
		subscribe,
		onFileCreate: handleFileCreate,
		onFileModify: handleFileModify,
		onFileRename: handleFileRename,
		onFileDelete: handleFileDelete,
	};
}

export const fileContentStore = createFileContentStore();
