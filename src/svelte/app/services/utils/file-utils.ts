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
