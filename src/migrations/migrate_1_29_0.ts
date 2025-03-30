import type { VaultExplorerPluginSettings_1_28_0 } from "src/types/types-1.28.0";
import type { VaultExplorerPluginSettings_1_29_0 } from "src/types/types-1.29.0";
import MigrationInterface from "./migration_interface";

export default class Migrate_1_29_0 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = data as unknown as VaultExplorerPluginSettings_1_28_0;
		const newData: VaultExplorerPluginSettings_1_29_0 = {
			...typedData,
			views: {
				...typedData.views,
				list: {
					...typedData.views.list,
					showTags: true,
				},
				grid: {
					...typedData.views.grid,
					loadSocialMediaImage: true,
				},
			},
		};

		return newData as unknown as Record<string, unknown>;
	}
}
