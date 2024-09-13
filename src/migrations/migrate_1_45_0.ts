import { VaultExplorerPluginSettings_1_44_6 } from "src/types/types-1.44.6";
import MigrationInterface from "./migration_interface";
import { TExplorerView, VaultExplorerPluginSettings } from "src/types";

export default class Migrate_1_45_0 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = data as unknown as VaultExplorerPluginSettings_1_44_6;

		let viewOrder = [];
		if (typedData.views.grid.isEnabled) {
			viewOrder.push(TExplorerView.GRID);
		}
		if (typedData.views.list.isEnabled) {
			viewOrder.push(TExplorerView.LIST);
		}
		if (typedData.views.feed.isEnabled) {
			viewOrder.push(TExplorerView.FEED);
		}
		if (typedData.views.table.isEnabled) {
			viewOrder.push(TExplorerView.TABLE);
		}

		const newData: VaultExplorerPluginSettings = {
			...typedData,
			confirmBeforeDelete: true,
			viewOrder,
		};
		return newData as unknown as Record<string, unknown>;
	}
}
