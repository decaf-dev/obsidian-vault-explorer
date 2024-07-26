import { VaultExplorerPluginSettings } from "src/types";
import MigrationInterface from "./migration_interface";
import { VaultExplorerPluginSettings_1_32_2 } from "src/types/types-1.32.2";

export default class Migrate_1_33_0 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = data as unknown as VaultExplorerPluginSettings_1_32_2;
		const newData: VaultExplorerPluginSettings = {
			...typedData,
		};

		delete (newData as any).fileInteractionStyle;
		return newData as unknown as Record<string, unknown>;
	}
}
