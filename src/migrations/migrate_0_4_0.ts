import { VaultExplorerPluginSettings_0_5_5 } from "src/types/types-0.5.5";
import { VaultExplorerPluginSettings_0_3_3 } from "src/types/types-0.3.3";
import MigrationInterface from "./migration_interface";

export default class Migrate_0_4_0 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = (data as unknown) as VaultExplorerPluginSettings_0_3_3;
		const newData: VaultExplorerPluginSettings_0_5_5 = {
			...typedData,
			filters: {
				...typedData.filters,
				properties: {
					...typedData.filters.properties,
					groups: []
				}
			},
		}
		return newData as unknown as Record<string, unknown>;
	}
}
