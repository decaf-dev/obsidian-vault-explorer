import { requestUrl } from "obsidian";

export const isImageExtension = (extension: string) => {
	switch (extension) {
		case "png":
		case "jpg":
		case "jpeg":
		case "gif":
		case "webp":
		case "svg":
		case "avif":
		case "bmp":
			return true;
		default:
			return false;
	}
};

export const fetchImageFromUrl = async (url: string) => {
	try {
		const response = await requestUrl({
			url,
			method: "GET",
		});
		console.log(response);

		const html = response.text;
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, "text/html");

		const getMetaTagContent = (property: string) => {
			const tag =
				doc.querySelector(`meta[property='${property}']`) ||
				doc.querySelector(`meta[name='${property}']`);
			return tag ? tag.getAttribute("content") : "";
		};

		const ogImage = getMetaTagContent("og:image");
		const twitterImage = getMetaTagContent("twitter:image");

		const imageUrl = ogImage || twitterImage;

		return imageUrl ?? null;
	} catch (error) {
		console.error("Failed to fetch image URL:", error);
		return null;
	}
};
