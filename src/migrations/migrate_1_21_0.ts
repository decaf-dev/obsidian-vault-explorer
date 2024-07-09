import MigrationInterface from "./migration_interface";
import { VaultExplorerPluginSettings_1_20_0 } from "src/types/types-1.20.0";
import { VaultExplorerPluginSettings_1_21_2 } from "src/types/types-1.21.2";

export default class Migrate_1_21_0 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = data as unknown as VaultExplorerPluginSettings_1_20_0;
		const newData: VaultExplorerPluginSettings_1_21_2 = {
			...typedData,
			enableFileIcons: true,
		};
		return newData as unknown as Record<string, unknown>;
	}
}
