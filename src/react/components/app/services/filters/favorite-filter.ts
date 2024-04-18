import { MarkdownFileData } from "../../types";

export const favoriteFilter = (file: MarkdownFileData, onlyFavorites: boolean) => {
	if (onlyFavorites) {
		return file.favorite;
	}
	return true;
}
