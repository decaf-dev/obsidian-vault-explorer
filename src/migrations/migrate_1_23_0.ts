import MigrationInterface from "./migration_interface";
import { VaultExplorerPluginSettings_1_22_0 } from "src/types/types-1.22.0";
import { VaultExplorerPluginSettings_1_23_0 } from "src/types/types-1.23.0";

export default class Migrate_1_23_0 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = data as unknown as VaultExplorerPluginSettings_1_22_0;
		const newData: VaultExplorerPluginSettings_1_23_0 = {
			...typedData,
			views: {
				...typedData.views,
				grid: {
					...typedData.views.grid,
					fetchSocialMediaImage: false,
				},
			},
		};
		return newData as unknown as Record<string, unknown>;
	}
}
