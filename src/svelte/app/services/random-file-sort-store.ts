import Logger from "js-logger";
import { TFile } from "obsidian";
import { writable } from "svelte/store";

type RandomFileSortStore = Record<string, number>;

function createRandomFileSortStore() {
	const { subscribe, set, update } = writable<RandomFileSortStore>({});

	function randomSortKey() {
		return Math.random();
	}

	function load(files: TFile[]) {
		Logger.trace({
			fileName: "random-file-sort-store.ts",
			functionName: "load",
			message: "called",
		});

		const randomSortFiles = files.reduce(
			(acc: Record<string, number>, file) => {
				const { path } = file;
				acc[path] = randomSortKey();
				return acc;
			},
			{}
		);

		set(randomSortFiles);
	}

	function handleFileCreate(path: string) {
		update((files) => {
			// Create a shallow copy of the files object to ensure reactivity
			return { ...files, [path]: randomSortKey() };
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
		onFileRename: handleFileRename,
		onFileDelete: handleFileDelete,
	};
}

export const randomFileSortStore = createRandomFileSortStore();
