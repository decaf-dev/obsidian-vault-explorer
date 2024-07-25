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

export const isImageUrl = (url: string) => {
	const pathname = new URL(url).pathname;
	const extension = pathname.split(".").pop();

	if (!extension) {
		return false;
	}
	return isImageExtension(extension);
};
