import MigrationInterface from "./migration_interface";
import { VaultExplorerPluginSettings_1_0_1 } from "src/types/types-1.0.1";
import { VaultExplorerPluginSettings_1_2_0, ViewType_1_2_0 } from "src/types/types-1.2.0";

export default class Migrate_1_1_0 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = (data as unknown) as VaultExplorerPluginSettings_1_0_1;
		const newData: VaultExplorerPluginSettings_1_2_0 = {
			...typedData,
			views: {
				currentView: typedData.currentView as unknown as ViewType_1_2_0,
				order: [ViewType_1_2_0.GRID, ViewType_1_2_0.LIST]
			}
		}
		return newData as unknown as Record<string, unknown>;
	}
}
