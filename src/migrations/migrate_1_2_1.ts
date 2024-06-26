import MigrationInterface from "./migration_interface";
import { VaultExplorerPluginSettings_1_2_0 } from "src/types/types-1.2.0";
import { VaultExplorerPluginSettings_1_2_1 } from "src/types/types-1.2.1";

export default class Migrate_1_2_1 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = (data as unknown) as VaultExplorerPluginSettings_1_2_0;
		const newData: VaultExplorerPluginSettings_1_2_1 = {
			...typedData,
			views: {
				...typedData.views,
				titleWrapping: "normal"
			}
		}
		return newData as unknown as Record<string, unknown>;
	}
}
