import { DBSchema, IDBPDatabase, openDB } from "idb";
import Logger from "js-logger";
import { Notice } from "obsidian";

const DATABASE_NAME = "vaultexplorer";
const STORE_NAME = "socialMediaImage";
const ONE_WEEK_MILLIS = 1000 * 60 * 60 * 24 * 7;
const ENTRY_EXPIRATION_TIME = ONE_WEEK_MILLIS;

interface SocialMediaImageEntry {
	url: string;
	socialMediaImageUrl: string | null; // null if no social media image found
	timestamp: number;
}

interface SocialMediaImageDB extends DBSchema {
	socialMediaImage: {
		key: string;
		value: SocialMediaImageEntry;
	};
}

export const isSocialMediaImageEntryExpired = async (
	entry: SocialMediaImageEntry
) => {
	if (Date.now() - entry.timestamp > ENTRY_EXPIRATION_TIME) {
		return true;
	}
	return false;
};

export const getSocialMediaImageEntry = async (url: string) => {
	const db = await openDatabase();
	const cachedEntry = await db.get(STORE_NAME, url);
	return cachedEntry ?? null;
};

/**
 * Puts a social media image URL into the cache
 * @param url - The URL of the page to cache the social media image for
 * @param smiUrl - The URL of the social media image
 */
export const putSocialMediaImageUrl = async (
	url: string,
	socialMediaImageUrl: string | null
) => {
	const db = await openDatabase();
	await db.put(STORE_NAME, {
		url,
		socialMediaImageUrl,
		timestamp: Date.now(),
	});
};

export const clearSocialMediaImageCache = async () => {
	Logger.trace({
		fileName: "social-media-image-cache.ts",
		functionName: "clearSocialMediaImageCache",
		message: "called",
	});
	try {
		const db = await openDatabase();
		await db.clear(STORE_NAME);
		new Notice("Vault Explorer: Image cache cleared");
	} catch (err) {
		new Notice("Vault Explorer: Failed to clear image cache");
		const error = err as Error;
		Logger.error(
			{
				fileName: "social-media-image-cache.ts",
				functionName: "clearSocialMediaImageCache",
				message: "failed to clear cache",
			},
			error.message
		);
	}
};

const openDatabase = () => {
	return openDB<SocialMediaImageDB>(DATABASE_NAME, 1, {
		upgrade(db) {
			db.createObjectStore(STORE_NAME, { keyPath: "url" });
		},
	});
};
