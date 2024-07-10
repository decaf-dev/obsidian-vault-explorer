import { VaultExplorerPluginSettings } from "src/types";
import MigrationInterface from "./migration_interface";
import { VaultExplorerPluginSettings_1_23_2 } from "src/types/types-1.23.2";

export default class Migrate_1_24_0 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = data as unknown as VaultExplorerPluginSettings_1_23_2;
		const newData: VaultExplorerPluginSettings = {
			...typedData,
			views: {
				...typedData.views,
				grid: {
					...typedData.views.grid,
					loadSocialMediaImage:
						typedData.views.grid.fetchSocialMediaImage,
				},
				feed: {
					...typedData.views.feed,
					collapseContent: true,
				},
			},
		};

		delete (newData as any).views.grid.fetchSocialMediaImage;
		return newData as unknown as Record<string, unknown>;
	}
}
