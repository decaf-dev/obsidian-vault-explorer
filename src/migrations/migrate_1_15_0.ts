import { VaultExplorerPluginSettings_1_16_0, ViewType_1_16_0 } from "src/types/types-1.16.0";
import MigrationInterface from "./migration_interface";
import { VaultExplorerPluginSettings_1_14_2 } from "src/types/types-1.14.2";

export default class Migrate_1_15_0 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = (data as unknown) as VaultExplorerPluginSettings_1_14_2;
		const newData: VaultExplorerPluginSettings_1_16_0 = {
			...typedData,
			views: {
				...typedData.views,
				order: [...typedData.views.order, ViewType_1_16_0.FEED],
			}
		}
		return newData as unknown as Record<string, unknown>;
	}
}
