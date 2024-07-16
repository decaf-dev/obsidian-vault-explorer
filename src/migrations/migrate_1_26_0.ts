import MigrationInterface from "./migration_interface";
import { VaultExplorerPluginSettings_1_25_2 } from "src/types/types-1.25.2";
import { VaultExplorerPluginSettings_1_26_3 } from "src/types/types-1.26.3";

export default class Migrate_1_26_0 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = data as unknown as VaultExplorerPluginSettings_1_25_2;
		const newData: VaultExplorerPluginSettings_1_26_3 = {
			...typedData,
			configDir: ".vaultexplorer",
		};

		return newData as unknown as Record<string, unknown>;
	}
}
