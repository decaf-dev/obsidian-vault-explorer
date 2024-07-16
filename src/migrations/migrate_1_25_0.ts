import MigrationInterface from "./migration_interface";
import { VaultExplorerPluginSettings_1_24_2 } from "src/types/types-1.24.2";
import { VaultExplorerPluginSettings_1_25_2 } from "src/types/types-1.25.2";

export default class Migrate_1_25_0 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = data as unknown as VaultExplorerPluginSettings_1_24_2;
		const newData: VaultExplorerPluginSettings_1_25_2 = {
			...typedData,
			fileInteractionStyle: "content",
		};

		return newData as unknown as Record<string, unknown>;
	}
}
