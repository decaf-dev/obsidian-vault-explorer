import { MarkdownFileRenderData } from "../../../../react/components/app/types";

export const favoriteFilter = (file: MarkdownFileRenderData, onlyFavorites: boolean) => {
	if (onlyFavorites) {
		return file.favorite;
	}
	return true;
}
