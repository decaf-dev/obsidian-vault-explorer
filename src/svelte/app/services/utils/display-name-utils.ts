import { TExplorerView } from "src/types";

export const getDisplayNameForView = (view: TExplorerView) => {
	switch (view) {
		case TExplorerView.DASHBOARD:
			return "Dashboard";
		case TExplorerView.GRID:
			return "Grid";
		case TExplorerView.LIST:
			return "List";
		case TExplorerView.FEED:
			return "Feed";
		case TExplorerView.TABLE:
			return "Table";
		case TExplorerView.RECOMMENDED:
			return "Recommended";
		case TExplorerView.RELATED:
			return "Related";
		default:
			throw new Error(`Unhandled view type: ${TExplorerView}`);
	}
}
