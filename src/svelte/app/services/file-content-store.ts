import { App, TFile } from "obsidian";
import { writable } from "svelte/store";

export type FileContentCache = Map<string, string | null>;

interface FileContent {
	path: string;
	content: string | null;
}

function createFileContentStore() {
	const { subscribe, set, update } = writable<FileContentCache>(new Map());

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

		const contentForFiles = new Map<string, string | null>(
			results.map((file) => [file.path, file.content])
		);
		set(contentForFiles);
	}

	async function handleFileCreate(app: App, file: TFile) {
		let content: string | null = null;
		if (file.extension === "md") {
			content = await app.vault.cachedRead(file);
		}

		update((currentCache) => {
			const newCache = new Map(currentCache);
			newCache.set(file.path, content);
			return newCache;
		});
	}

	function handleFileRename(oldPath: string, newPath: string) {
		update((currentCache) => {
			const content = currentCache.get(oldPath);
			if (content !== undefined) {
				const newCache = new Map(currentCache);
				newCache.set(newPath, content);
				newCache.delete(oldPath);
				return newCache;
			}
			return currentCache;
		});
	}

	function handleFileModify(path: string, newContent: string | null) {
		update((currentCache) => {
			const newCache = new Map(currentCache);
			newCache.set(path, newContent);
			return newCache;
		});
	}

	function handleFileDelete(path: string) {
		update((currentCache) => {
			const newCache = new Map(currentCache);
			newCache.delete(path);
			return newCache;
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
