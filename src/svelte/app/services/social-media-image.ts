import Logger from "js-logger";
import { requestUrl } from "obsidian";

export const fetchSocialMediaImage = async (url: string) => {
	Logger.trace({
		fileName: "social-media-image.ts",
		functionName: "fetchSocialMediaImage",
		message: "called",
	});

	try {
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
					message: "found social media image",
				},
				{ imageUrl }
			);
		} else {
			Logger.warn(
				{
					fileName: "social-media-image.ts",
					functionName: "fetchSocialMediaImage",
					message: "no social media image found for url",
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
			{ error }
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
