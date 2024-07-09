import MigrationInterface from "./migration_interface";
import { VaultExplorerPluginSettings_1_21_2 } from "src/types/types-1.21.2";
import { VaultExplorerPluginSettings_1_22_0 } from "src/types/types-1.22.0";

export default class Migrate_1_22_0 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = data as unknown as VaultExplorerPluginSettings_1_21_2;
		const newData: VaultExplorerPluginSettings_1_22_0 = {
			...typedData,
			properties: {
				...typedData.properties,
				imageUrl: "",
			},
			filterGroupsWidth: 300,
			filterGroupsWrapping: "nowrap",
		};
		return newData as unknown as Record<string, unknown>;
	}
}
