import MigrationInterface from "./migration_interface";
import { VaultExplorerPluginSettings_1_23_0 } from "src/types/types-1.23.0";
import { VaultExplorerPluginSettings_1_23_2 } from "src/types/types-1.23.2";

export default class Migrate_1_23_1 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = data as unknown as VaultExplorerPluginSettings_1_23_0;
		const newData: VaultExplorerPluginSettings_1_23_2 = {
			...typedData,
			filterGroupsWidth: "100%",
		};
		return newData as unknown as Record<string, unknown>;
	}
}
