import { requestUrl } from "obsidian";

export const fetchSocialMediaImage = async (url: string) => {
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

		return imageUrl ?? null;
	} catch (error) {
		console.error("Failed to fetch image URL:", error);
		return null;
	}
};

const getMetaTagContent = (document: Document, property: string) => {
	const tag =
		document.querySelector(`meta[property='${property}']`) ||
		document.querySelector(`meta[name='${property}']`);
	return tag ? tag.getAttribute("content") : "";
};
