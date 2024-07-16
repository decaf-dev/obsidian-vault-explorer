import Logger from "js-logger";
import { App } from "obsidian";
import { writable } from "svelte/store";

export type RandomFileSortCache = Map<string, number>;

function createRandomFileSortStore() {
	const { subscribe, set, update } = writable<RandomFileSortCache>(new Map());

	function load(app: App) {
		Logger.trace({
			fileName: "random-file-sort-store.ts",
			functionName: "load",
			message: "called",
		});

		const files = app.vault.getFiles();
		const randomSortFiles = new Map<string, number>(
			files.map((file) => [file.path, randomSortKey()])
		);
		set(randomSortFiles);
	}

	function handleFileCreate(path: string) {
		update((currentCache) => {
			const newCache = new Map(currentCache);
			newCache.set(path, randomSortKey());
			return newCache;
		});
	}

	function handleFileRename(oldPath: string, newPath: string) {
		update((currentCache) => {
			const sortKey = currentCache.get(oldPath);
			if (sortKey !== undefined) {
				const newCache = new Map(currentCache);
				newCache.set(newPath, sortKey);
				newCache.delete(oldPath);
				return newCache;
			}
			return currentCache;
		});
	}

	function handleFileDelete(path: string) {
		update((currentCache) => {
			const newCache = new Map(currentCache);
			newCache.delete(path);
			return newCache;
		});
	}

	function randomSortKey() {
		return Math.random();
	}

	return {
		load,
		subscribe,
		onFileCreate: handleFileCreate,
		onFileRename: handleFileRename,
		onFileDelete: handleFileDelete,
	};
}

export const randomFileSortStore = createRandomFileSortStore();
