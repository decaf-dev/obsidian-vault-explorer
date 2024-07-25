import { VaultExplorerPluginSettings } from "src/types";
import MigrationInterface from "./migration_interface";
import { VaultExplorerPluginSettings_1_30_5 } from "src/types/types-1.30.5";

export default class Migrate_1_31_0 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = data as unknown as VaultExplorerPluginSettings_1_30_5;
		const newData: VaultExplorerPluginSettings = {
			...typedData,
			shouldWrapFilterGroups: typedData.filterGroupsWrapping === "wrap",
		};

		delete (newData as any).filterGroupsWrapping;
		return newData as unknown as Record<string, unknown>;
	}
}
