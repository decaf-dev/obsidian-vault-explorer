import { ViewType } from "src/types";

export const getDisplayNameForViewType = (viewType: ViewType) => {
	switch (viewType) {
		case ViewType.GRID:
			return "Grid";
		case ViewType.LIST:
			return "List";
		case ViewType.FEED:
			return "Feed";
		default:
			throw new Error(`Unhandled view type: ${viewType}`);
	}
}
