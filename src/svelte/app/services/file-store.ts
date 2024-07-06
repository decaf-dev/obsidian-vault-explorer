import { App, TFile } from "obsidian";
import { writable } from "svelte/store";

type FileStore = TFile[];

function createFileStore() {
	const { subscribe, set, update } = writable<FileStore>([]);

	async function load(app: App) {
		set(app.vault.getFiles());
	}

	async function handleFileCreate(file: TFile) {
		update((files) => {
			// Create a shallow copy of the files object to ensure reactivity
			return [...files, file];
		});
	}

	function handleFileRename(oldPath: string, updatedFile: TFile) {
		update((files) => {
			return files.map((file) => {
				if (file.path === oldPath) {
					return updatedFile;
				}
				return file;
			});
		});
	}

	function handleFileDelete(path: string) {
		update((files) => {
			return files.filter((file) => file.path !== path);
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

export const fileStore = createFileStore();
