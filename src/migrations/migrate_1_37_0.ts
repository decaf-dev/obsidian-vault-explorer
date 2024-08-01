import { VaultExplorerPluginSettings } from "src/types";
import MigrationInterface from "./migration_interface";
import { VaultExplorerPluginSettings_1_36_3 } from "src/types/types-1.36.3";

export default class Migrate_1_37_0 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = data as unknown as VaultExplorerPluginSettings_1_36_3;
		const newData: VaultExplorerPluginSettings = {
			...typedData,
		};

		delete (newData as any).enableScrollButtons;
		return newData as unknown as Record<string, unknown>;
	}
}
