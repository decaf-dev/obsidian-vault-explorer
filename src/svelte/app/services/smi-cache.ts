import { DBSchema, openDB } from "idb";
import Logger from "js-logger";
import { Notice } from "obsidian";

const DATABASE_NAME = "vaultexplorer";
const STORE_NAME = "socialMediaImage";
const ONE_WEEK_MILLIS = 1000 * 60 * 60 * 24 * 7;
const ENTRY_EXPIRATION_TIME = ONE_WEEK_MILLIS;

interface SocialMediaImageEntry {
	url: string;
	smiUrl: string | null; // null if no social media image found
	timestamp: number;
}

interface SocialMediaImageDB extends DBSchema {
	socialMediaImage: {
		key: string;
		value: SocialMediaImageEntry;
	};
}

export const isSMICacheEntryExpired = async (entry: SocialMediaImageEntry) => {
	if (Date.now() - entry.timestamp > ENTRY_EXPIRATION_TIME) {
		return true;
	}
	return false;
};

export const getSMICacheEntry = async (websiteUrl: string) => {
	Logger.trace({
		fileName: "smi-cache.ts",
		functionName: "getSMICacheEntry",
		message: "called",
	});

	Logger.debug(
		{
			fileName: "grid-card.svelte",
			functionName: "getCachedSocialMediaUrl",
			message: "getting cached entry",
		},
		{
			websiteUrl,
		}
	);
	const db = await openDatabase();
	const cachedEntry = await db.get(STORE_NAME, websiteUrl);
	return cachedEntry ?? null;
};

/**
 * Puts a social media image URL into the cache
 * @param url - The URL of the page to cache the social media image for
 * @param smiUrl - The URL of the social media image
 */
export const putSMICacheEntry = async (url: string, smiUrl: string | null) => {
	Logger.trace({
		fileName: "smi-cache.ts",
		functionName: "putSMICacheEntry",
		message: "called",
	});

	Logger.debug(
		{
			fileName: "smi-cache.ts",
			functionName: "putSMICacheEntry",
			message: "putting entry",
		},
		{
			url,
			smiUrl,
		}
	);

	const db = await openDatabase();
	await db.put(STORE_NAME, {
		url,
		smiUrl,
		timestamp: Date.now(),
	});
};

export const clearSMICache = async () => {
	Logger.trace({
		fileName: "smi-cache.ts",
		functionName: "clearSMICache",
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
				fileName: "smi-cache.ts",
				functionName: "clearSMICache",
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
