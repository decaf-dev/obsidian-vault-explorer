import Logger from "js-logger";
import _ from "lodash";
import { App, normalizePath, Notice } from "obsidian";
import { VaultExplorerPluginSettings } from "src/types";
import { Writable, writable } from "svelte/store";

interface FavoritesItem {
	filePath: string;
	isFavorite: boolean;
}

/**
 * The number of milliseconds to wait before saving the favorites cache.
 */
const DEBOUNCE_SAVE_MILLIS = 200;

/**
 * The name of the file where the favorites are stored.
 * This file is stored in the vault explorer config directory.
 */
const FAVORITES_FILE = "favorites.json";

export type TFavoritesCache = Map<string, boolean>;

class FavoritesStore {
	store: Writable<TFavoritesCache>;
	settings: VaultExplorerPluginSettings | null;
	app: App | null;

	constructor() {
		this.store = writable<TFavoritesCache>(new Map<string, boolean>());
		this.settings = null;
		this.app = null;
	}

	debounceSave = _.debounce(
		(cache: TFavoritesCache) => this.save(cache),
		DEBOUNCE_SAVE_MILLIS
	);

	async load(app: App, settings: VaultExplorerPluginSettings) {
		Logger.trace({
			fileName: "favorites-store.ts",
			functionName: "load",
			message: "called",
		});

		const directoryExists = await app.vault.adapter.exists(
			settings.configDir
		);
		if (!directoryExists) {
			const result = this.createConfigDir(app, settings.configDir);
			if (!result) return;
		}

		const filePath = this.getFavoritesFilePath(settings.configDir);
		const fileExists = await app.vault.adapter.exists(filePath);
		if (!fileExists) {
			const result = this.createFavoritesFile(app, filePath);
			if (!result) return;
		}

		try {
			const cache = new Map<string, boolean>();
			const rawData = await app.vault.adapter.read(filePath);

			const items = this.parseItems<FavoritesItem>(rawData);
			items.forEach((item) => {
				const { filePath, isFavorite } = item;
				cache.set(filePath, isFavorite);
			});

			this.store.set(cache);
			this.settings = settings;
			this.app = app;

			Logger.debug(
				{
					fileName: "favorites-store.ts",
					functionName: "load",
					message: "loaded favorites cache",
				},
				{ cache }
			);
		} catch (err) {
			const error = err as Error;
			Logger.error(
				{
					fileName: "favorites-store.ts",
					functionName: "load",
					message: "error loading favorites cache",
				},
				error.message
			);
			new Notice("Vault Explorer: error loading favorites cache");
		}
	}

	setFavorite(filePath: string, isFavorite: boolean) {
		Logger.trace({
			fileName: "favorites-store.ts",
			functionName: "update",
			message: "called",
		});

		this.store.update((currentCache) => {
			const newCache = new Map(currentCache);
			newCache.set(filePath, isFavorite);
			this.debounceSave(newCache);
			return newCache;
		});
	}

	onFileRename(oldPath: string, newPath: string) {
		Logger.trace({
			fileName: "favorites-store.ts",
			functionName: "onFileRename",
			message: "called",
		});

		this.store.update((currentCache) => {
			const isFavorite = currentCache.get(oldPath);
			if (isFavorite !== undefined) {
				const newCache = new Map(currentCache);
				newCache.set(newPath, isFavorite);
				newCache.delete(oldPath);
				this.debounceSave(newCache);
			}
			return currentCache;
		});
	}

	onFileDelete(path: string) {
		Logger.trace({
			fileName: "favorites-store.ts",
			functionName: "onFileDelete",
			message: "called",
		});

		this.store.update((currentCache) => {
			const newCache = new Map(currentCache);
			newCache.delete(path);
			this.debounceSave(newCache);
			return newCache;
		});
	}

	private async save(cache: TFavoritesCache) {
		Logger.trace({
			fileName: "favorites-store.ts",
			functionName: "save",
			message: "called",
		});

		if (!this.app) {
			throw new Error("App is null. Please call load() first.");
		}
		if (!this.settings) {
			throw new Error("Settings are null. Please call load() first.");
		}

		try {
			const path = this.getFavoritesFilePath(this.settings.configDir);
			const rawData = this.stringifyCache(cache);
			await this.app.vault.adapter.write(path, rawData);
		} catch (err) {
			const error = err as Error;
			Logger.error(
				{
					fileName: "favorites-store.ts",
					functionName: "save",
					message: "error saving favorites cache",
				},
				error.message
			);
			new Notice("Vault Explorer: error saving favorites cache");
		}
	}

	private async createConfigDir(app: App, configDir: string) {
		Logger.debug({
			fileName: "favorites-store.ts",
			functionName: "createConfigDir",
			message: "called",
		});

		try {
			await app.vault.adapter.mkdir(configDir);
			return true;
		} catch (err) {
			const error = err as Error;
			Logger.error(
				{
					fileName: "favorites-store.ts",
					functionName: "load",
					message: "error creating vault explorer directory",
				},
				error.message
			);
			new Notice(
				"Vault Explorer: error creating vault explorer directory"
			);
			return false;
		}
	}

	private async createFavoritesFile(app: App, filePath: string) {
		if (!this.app) {
			throw new Error("App is null. Please call load() first.");
		}

		try {
			Logger.debug({
				fileName: "favorites-store.ts",
				functionName: "load",
				message: "creating new file...",
			});
			const data = this.stringifyCache(new Map<string, boolean>());
			await app.vault.create(filePath, data);
			return true;
		} catch (err) {
			const error = err as Error;
			Logger.error(
				{
					fileName: "favorites-store.ts",
					functionName: "load",
					message: "error creating favorites file",
				},
				error.message
			);
			new Notice("Vault Explorer: error creating favorites file");
			return false;
		}
	}

	private getFavoritesFilePath(configDir: string) {
		return normalizePath(configDir + "/" + FAVORITES_FILE);
	}

	private parseItems<T>(rawData: string): T[] {
		const json = JSON.parse(rawData);
		if (!json.items) return [];
		return json.items;
	}

	private stringifyCache(cache: TFavoritesCache) {
		const items = Array.from(cache.entries()).map(
			([filePath, isFavorite]) => ({
				filePath,
				isFavorite,
			})
		);

		return JSON.stringify(
			{
				items,
			},
			null,
			2
		);
	}
}

export const favoritesStore = new FavoritesStore();
