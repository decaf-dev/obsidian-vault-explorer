const IMAGE_EXTENSIONS = [
	"png",
	"jpg",
	"jpeg",
	"gif",
	"webp",
	"svg",
	"avif",
	"bmp",
];

export const isImageExtension = (extension: string) => {
	return IMAGE_EXTENSIONS.includes(extension);
};

/**
 * Checks if the url is an image url
 * It must have an extension that is in the IMAGE_EXTENSIONS array
 * @param url - The url to check
 */
export const isImageUrl = (url: string) => {
	try {
		const pathname = new URL(url).pathname;
		const extension = pathname.split(".").pop();

		if (!extension) return false;
		return isImageExtension(extension);
	} catch (error) {
		return false;
	}
};

/**
 * Finds the first image embed in the content and returns the target
 * The target is the URI of the image.
 * @param content - The content to search for an image embed
 * @returns
 */
export const findFirstImageEmbedTarget = (content: string) => {
	//Example: ![[file.jpg]]
	const OBSIDIAN_LINK_REGEX = /!\[\[([^\]|]+)\]\]/;

	//Example: ![[file.jpg|200]]
	const OBSIDIAN_LINK_WITH_PARAM_REGEX = /!\[\[([^\]|]+)\|[^\]]+\]\]/;

	//Example: ![cover](https://example.com/file.jpg)
	const STANDARD_EMBED_REGEX = /!\[[^\]]*\]\(([^)]+)\)/;

	//Check for obsidian link
	const matchObsidian = content.match(OBSIDIAN_LINK_REGEX);
	if (matchObsidian) {
		const link = matchObsidian[1];
		for (const extension of IMAGE_EXTENSIONS) {
			if (link.endsWith(extension)) {
				return matchObsidian[1];
			}
		}
	}

	//Check for obsidian link with param
	const matchObsidianWithParam = content.match(
		OBSIDIAN_LINK_WITH_PARAM_REGEX
	);

	if (matchObsidianWithParam) {
		const link = matchObsidianWithParam[1];
		for (const extension of IMAGE_EXTENSIONS) {
			if (link.endsWith(extension)) {
				return matchObsidianWithParam[1];
			}
		}
	}

	//Check for standard image embed
	//This may or may not have an iamge extension
	const matchStandard = content.match(STANDARD_EMBED_REGEX);
	if (matchStandard) {
		const link = matchStandard[1];
		return link;
	}
	return null;
};
