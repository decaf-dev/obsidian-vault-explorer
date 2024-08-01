import { CoverImageSourceType } from "src/types";

export const getDisplayNameForImageSource = (type: CoverImageSourceType) => {
	switch (type) {
		case "image-property":
			return "Image property";
		case "url-property":
			return "URL property";
		case "frontmatter":
			return "Frontmatter";
		case "body":
			return "Body";
		default:
			return "";
	}
};
