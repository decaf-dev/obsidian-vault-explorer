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

export const endsWithImageExtension = (url: string) => {
	for (const extension of IMAGE_EXTENSIONS) {
		if (url.endsWith(extension)) {
			return true;
		}
	}
	return false;
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
