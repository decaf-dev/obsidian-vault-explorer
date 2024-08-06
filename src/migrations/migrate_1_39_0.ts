import MigrationInterface from "./migration_interface";
import { VaultExplorerPluginSettings_1_38_0 } from "src/types/types-1.38.0";
import {
	TExplorerView_1_39_0,
	VaultExplorerPluginSettings_1_39_0,
} from "src/types/types-1.39.0";

export default class Migrate_1_39_0 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = data as unknown as VaultExplorerPluginSettings_1_38_0;
		const newData: VaultExplorerPluginSettings_1_39_0 = {
			...typedData,
			viewOrder: [
				TExplorerView_1_39_0.GRID,
				TExplorerView_1_39_0.LIST,
				TExplorerView_1_39_0.TABLE,
				TExplorerView_1_39_0.FEED,
			],
			views: {
				...typedData.views,
				table: {
					isEnabled: true,
				},
			},
		};

		return newData as unknown as Record<string, unknown>;
	}
}
