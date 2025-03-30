import type { VaultExplorerPluginSettings_1_39_0 } from "src/types/types-1.39.0";
import type { VaultExplorerPluginSettings_1_40_2 } from "src/types/types-1.40.2";
import MigrationInterface from "./migration_interface";

export default class Migrate_1_40_0 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = data as unknown as VaultExplorerPluginSettings_1_39_0;
		const newData: VaultExplorerPluginSettings_1_40_2 = {
			...typedData,
			shouldCollapseFilters: false,
		};

		return newData as unknown as Record<string, unknown>;
	}
}
