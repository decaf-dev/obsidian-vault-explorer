import { VaultExplorerPluginSettings } from "src/types";
import MigrationInterface from "./migration_interface";
import { VaultExplorerPluginSettings_1_28_0 } from "src/types/types-1.28.0";

export default class Migrate_1_29_0 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = data as unknown as VaultExplorerPluginSettings_1_28_0;
		const newData: VaultExplorerPluginSettings = {
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
