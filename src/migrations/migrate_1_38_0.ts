import { VaultExplorerPluginSettings_1_37_2 } from "src/types/types-1-37-0";
import MigrationInterface from "./migration_interface";
import { VaultExplorerPluginSettings } from "src/types";

export default class Migrate_1_38_0 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = data as unknown as VaultExplorerPluginSettings_1_37_2;
		const newData: VaultExplorerPluginSettings = {
			...typedData,
			loadBodyTags: true,
		};

		return newData as unknown as Record<string, unknown>;
	}
}
