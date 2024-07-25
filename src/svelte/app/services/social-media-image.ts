import { DBSchema, IDBPDatabase, openDB } from "idb";
import Logger from "js-logger";
import { requestUrl } from "obsidian";

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
	const db = await openDatabase();
	await db.clear(STORE_NAME);
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
				Logger.debug({
					fileName: "social-media-image.ts",
					functionName: "fetchSocialMediaImage",
					message:
						"timestamp is within expiration time. returning cached image url",
				});
				return socialImageUrl;
			}
		}

		const response = await requestUrl({
			url,
			method: "GET",
		});

		const html = response.text;
		const parser = new DOMParser();
		const document = parser.parseFromString(html, "text/html");

		const ogImage = getMetaTagContent(document, "og:image");
		const twitterImage = getMetaTagContent(document, "twitter:image");

		const imageUrl = ogImage || twitterImage;

		if (imageUrl) {
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
	return tag ? tag.getAttribute("content") : "";
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
