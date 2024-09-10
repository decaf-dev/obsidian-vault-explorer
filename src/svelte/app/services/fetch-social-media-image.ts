import Logger from "js-logger";
import { requestUrl } from "obsidian";

export const fetchSocialMediaImage = async (url: string) => {
	Logger.trace({
		fileName: "fetch-social-media-image.ts",
		functionName: "fetchSocialMediaImage",
		message: "called",
	});

	try {
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

			//Handle edge case where the url ends with @100w_100h_1c
			//See issue #265
			if (imageUrl.endsWith("@100w_100h_1c.png")) {
				imageUrl = imageUrl.replace(
					/@100w_100h_1c.png$/,
					"@425w_150h_1c.png"
				);
			}

			Logger.debug(
				{
					fileName: "social-media-image.ts",
					functionName: "fetchSocialMediaImage",
					message: "found image",
				},
				{ imageUrl }
			);
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
