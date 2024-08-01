import MigrationInterface from "./migration_interface";
import { VaultExplorerPluginSettings_1_30_5 } from "src/types/types-1.30.5";
import { VaultExplorerPluginSettings_1_32_2 } from "src/types/types-1.32.2";

export default class Migrate_1_31_0 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = data as unknown as VaultExplorerPluginSettings_1_30_5;
		const newData: VaultExplorerPluginSettings_1_32_2 = {
			...typedData,
			shouldWrapFilterGroups: typedData.filterGroupsWrapping === "wrap",
		};

		delete (newData as any).filterGroupsWrapping;
		return newData as unknown as Record<string, unknown>;
	}
}
