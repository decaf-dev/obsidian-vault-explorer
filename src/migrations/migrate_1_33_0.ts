import type { VaultExplorerPluginSettings_1_32_2 } from "src/types/types-1.32.2";
import type { VaultExplorerPluginSettings_1_36_3 } from "src/types/types-1.36.3";
import MigrationInterface from "./migration_interface";

export default class Migrate_1_33_0 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = data as unknown as VaultExplorerPluginSettings_1_32_2;
		const newData: VaultExplorerPluginSettings_1_36_3 = {
			...typedData,
		};

		delete (newData as any).fileInteractionStyle;
		return newData as unknown as Record<string, unknown>;
	}
}
