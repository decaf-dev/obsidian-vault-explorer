import { TExplorerView } from "src/types";

export const getDisplayNameForView = (view: TExplorerView) => {
	switch (view) {
		case TExplorerView.GRID:
			return "Grid";
		case TExplorerView.LIST:
			return "List";
		case TExplorerView.FEED:
			return "Feed";
		case TExplorerView.TABLE:
			return "Table";
		default:
			throw new Error(`Unhandled view type: ${TExplorerView}`);
	}
};
