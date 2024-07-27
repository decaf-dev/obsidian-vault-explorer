import { DBSchema, IDBPDatabase, openDB } from "idb";
import Logger from "js-logger";
import { Notice, requestUrl } from "obsidian";

const DATABASE_NAME = "vaultexplorer";
const STORE_NAME = "socialMediaImage";
const ONE_WEEK_MILLIS = 1000 * 60 * 60 * 24 * 7;
const ENTRY_EXPIRATION_TIME = ONE_WEEK_MILLIS;

interface SocialImageDB extends DBSchema {
	socialMediaImage: {
		key: string;
		value: {
			url: string;
			socialImageUrl: string;
			timestamp: number;
		};
	};
}

export const clearSocialImageCache = async () => {
	Logger.trace({
		fileName: "social-media-image.ts",
		functionName: "clearSocialMediaImageCache",
		message: "called",
	});
	try {
		const db = await openDatabase();
		await db.clear(STORE_NAME);
		new Notice("Vault Explorer: social media image cache cleared");
	} catch (err) {
		new Notice("Failed to clear social media image cache");
		const error = err as Error;
		Logger.error(
			{
				fileName: "social-media-image.ts",
				functionName: "clearSocialMediaImageCache",
				message: "failed to clear cache",
			},
			error.message
		);
	}
};

export const fetchSocialImage = async (url: string) => {
	Logger.trace({
		fileName: "social-media-image.ts",
		functionName: "fetchSocialMediaImage",
		message: "called",
	});

	try {
		const entry = await getCachedSocialImageEntry(url);
		if (entry !== null) {
			Logger.trace(
				{
					fileName: "social-media-image.ts",
					functionName: "fetchSocialMediaImage",
					message: "found cached entry",
				},
				entry
			);
			if (Date.now() - entry.timestamp < ENTRY_EXPIRATION_TIME) {
				const { socialImageUrl } = entry;
				return socialImageUrl;
			} else {
				Logger.debug({
					fileName: "social-media-image.ts",
					functionName: "fetchSocialMediaImage",
					message: "timestamp is past expiration time. refetching...",
				});
			}
		}

		const response = await requestUrl({
			url,
			method: "GET",
			headers: {
				Cookie: "", // Clear any cookies
			},
		});

		const html = response.text;
		const parser = new DOMParser();
		const document = parser.parseFromString(html, "text/html");

		const ogImage = getMetaTagContent(document, "og:image");
		const twitterImage = getMetaTagContent(document, "twitter:image");

		let imageUrl = ogImage || twitterImage;

		if (imageUrl) {
			//Handle edge case where social media image URL has slashes at the beginning
			//See issue #265
			if (imageUrl.startsWith("//")) {
				imageUrl = imageUrl.replace(/^\/+/, "");
			}

			//Handle edge case where the url doesn't start with https://
			//See issue #265
			if (!imageUrl.startsWith("https://")) {
				imageUrl = `https://${imageUrl}`;
			}

			Logger.debug(
				{
					fileName: "social-media-image.ts",
					functionName: "fetchSocialMediaImage",
					message: "found image",
				},
				{ imageUrl }
			);
			await putSocialImageUrl(url, imageUrl);
		} else {
			Logger.debug(
				{
					fileName: "social-media-image.ts",
					functionName: "fetchSocialMediaImage",
					message: "no image found",
				},
				{ url }
			);
		}

		return imageUrl ?? null;
	} catch (error) {
		Logger.error(
			{
				fileName: "social-media-image.ts",
				functionName: "fetchSocialMediaImage",
				message: "failed to fetch",
			},
			error
		);
		return null;
	}
};

const getMetaTagContent = (document: Document, property: string) => {
	const tag =
		document.querySelector(`meta[property='${property}']`) ||
		document.querySelector(`meta[name='${property}']`);
	return tag ? tag.getAttribute("content") : null;
};

const putSocialImageUrl = async (url: string, socialImageUrl: string) => {
	const db = await openDatabase();
	db.put(STORE_NAME, { url, socialImageUrl, timestamp: Date.now() });
};

const getCachedSocialImageEntry = async (url: string) => {
	const db = await openDatabase();
	const cachedEntry = await db.get(STORE_NAME, url);
	return cachedEntry ?? null;
};

const openDatabase = (): Promise<IDBPDatabase<SocialImageDB>> => {
	return openDB<SocialImageDB>(DATABASE_NAME, 1, {
		upgrade(db) {
			db.createObjectStore(STORE_NAME, { keyPath: "url" });
		},
	});
};
