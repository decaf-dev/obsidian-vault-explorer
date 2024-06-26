import MigrationInterface from "./migration_interface";
import { VaultExplorerPluginSettings_1_6_0 } from "src/types/types-1.6.0";
import { VaultExplorerPluginSettings_1_8_1 } from "src/types/types-1.8.1";

export default class Migrate_1_6_1 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = (data as unknown) as VaultExplorerPluginSettings_1_6_0;
		const newData: VaultExplorerPluginSettings_1_8_1 = {
			...typedData,
			properties: {
				...typedData.properties,
				createdDate: "",
				modifiedDate: ""
			}
		}
		delete (newData.properties as any).creationDate;
		return newData as unknown as Record<string, unknown>;
	}
}
