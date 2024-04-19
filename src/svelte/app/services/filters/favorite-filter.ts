import { MarkdownFileRenderData } from "../../types";


export const favoriteFilter = (file: MarkdownFileRenderData, onlyFavorites: boolean) => {
	if (onlyFavorites) {
		return file.favorite;
	}
	return true;
}
