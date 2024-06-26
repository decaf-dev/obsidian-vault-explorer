import MigrationInterface from "./migration_interface";
import { VaultExplorerPluginSettings_1_5_0 } from "src/types/types-1.5.0";
import { VaultExplorerPluginSettings_1_6_0 } from "src/types/types-1.6.0";

export default class Migrate_1_6_0 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = (data as unknown) as VaultExplorerPluginSettings_1_5_0;
		const newData: VaultExplorerPluginSettings_1_6_0 = {
			...typedData,
			properties: {
				...typedData.properties,
				creationDate: "",
				modifiedDate: ""
			}
		}
		return newData as unknown as Record<string, unknown>;
	}
}
