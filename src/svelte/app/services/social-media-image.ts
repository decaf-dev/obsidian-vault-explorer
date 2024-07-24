import { DBSchema, IDBPDatabase, openDB } from "idb";
import Logger from "js-logger";
import { requestUrl } from "obsidian";

const DATABASE_NAME = "vaultexplorer";
const STORE_NAME = "socialMediaImage";

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
		const cachedUrl = await getCachedSocialImageUrl(url);
		if (cachedUrl !== null) {
			Logger.debug(
				{
					fileName: "social-media-image.ts",
					functionName: "fetchSocialMediaImage",
					message: "found cached url",
				},
				{ cachedUrl }
			);
			return cachedUrl;
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
			Logger.warn(
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

const getCachedSocialImageUrl = async (url: string) => {
	const db = await openDatabase();
	const cachedEntry = await db.get(STORE_NAME, url);
	return cachedEntry ? cachedEntry.socialImageUrl : null;
};

const openDatabase = (): Promise<IDBPDatabase<SocialImageDB>> => {
	return openDB<SocialImageDB>(DATABASE_NAME, 1, {
		upgrade(db) {
			db.createObjectStore(STORE_NAME, { keyPath: "url" });
		},
	});
};
