import { MarkdownFileRenderData } from "../../types";


export const filterByFavorites = (file: MarkdownFileRenderData, onlyFavorites: boolean) => {
	if (onlyFavorites) {
		return file.favorite;
	}
	return true;
}
