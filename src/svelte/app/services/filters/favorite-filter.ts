import { FileRenderData } from "../../types";


export const filterByFavorites = (file: FileRenderData, onlyFavorites: boolean) => {
	if (onlyFavorites) {
		return file.favorite;
	}
	return true;
}
