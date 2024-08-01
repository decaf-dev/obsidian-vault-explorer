import { CoverImageSourceType } from "src/types";

export const getDisplayNameForImageSource = (type: CoverImageSourceType) => {
	switch (type) {
		case "image-property":
			return "Image Property";
		case "url-property":
			return "URL";
		case "frontmatter":
			return "Frontmatter";
		case "body":
			return "Body";
		default:
			return "";
	}
};
