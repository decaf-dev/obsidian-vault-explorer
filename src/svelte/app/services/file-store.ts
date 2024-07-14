import { App, TFile } from "obsidian";
import { generateRandomId } from "src/svelte/shared/services/random";
import { writable } from "svelte/store";

export interface LoadedFile {
	id: string;
	file: TFile;
}

type FileStore = LoadedFile[];

function createFileStore() {
	const { subscribe, set, update } = writable<FileStore>([]);

	async function load(app: App) {
		const files = app.vault.getFiles();
		const loadedFiles: LoadedFile[] = files.map((file) => ({
			id: generateRandomId(),
			file,
		}));
		set(loadedFiles);
	}

	async function handleFileCreate(file: TFile) {
		const newLoadedFile: LoadedFile = {
			id: generateRandomId(),
			file,
		};

		update((loadedFiles) => {
			// Create a shallow copy of the files object to ensure reactivity
			return [...loadedFiles, newLoadedFile];
		});
	}

	function handleFileRename(oldPath: string, updatedFile: TFile) {
		update((loadedFiles) => {
			return loadedFiles.map((loadedFile) => {
				if (loadedFile.file.path === oldPath) {
					return {
						...loadedFile,
						file: updatedFile,
					};
				}
				return loadedFile;
			});
		});
	}

	function handleFileDelete(path: string) {
		update((loadedFiles) => {
			return loadedFiles.filter(
				(loadedFiles) => loadedFiles.file.path !== path
			);
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
