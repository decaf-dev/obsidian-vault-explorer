import MigrationInterface from "./migration_interface";
import { TExplorerView, VaultExplorerPluginSettings } from "src/types";
import { VaultExplorerPluginSettings_1_38_0 } from "src/types/types-1.38.0";

export default class Migrate_1_39_0 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = data as unknown as VaultExplorerPluginSettings_1_38_0;
		const newData: VaultExplorerPluginSettings = {
			...typedData,
			viewOrder: [
				TExplorerView.GRID,
				TExplorerView.LIST,
				TExplorerView.TABLE,
				TExplorerView.FEED,
			],
		};

		return newData as unknown as Record<string, unknown>;
	}
}
