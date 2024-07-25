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

export const isImageUrl = (url: string) => {
	const pathname = new URL(url).pathname;
	const extension = pathname.split(".").pop();

	if (!extension) return false;
	return isImageExtension(extension);
};

export const findFirstImageEmbed = (content: string) => {
	const MARKDOWN_EMBED_REGEX = /!\[\[([^\]]+)\]\]/;
	const match = content.match(MARKDOWN_EMBED_REGEX);

	if (match) {
		const link = match[1];
		for (const extension of IMAGE_EXTENSIONS) {
			if (link.endsWith(extension)) {
				return link;
			}
		}
	}
	return null;
};
