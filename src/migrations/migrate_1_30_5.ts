import { VaultExplorerPluginSettings_1_30_5 } from "src/types/types-1.30.5";
import MigrationInterface from "./migration_interface";
import { VaultExplorerPluginSettings_1_29_0 } from "src/types/types-1.29.0";

export default class Migrate_1_30_0 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = data as unknown as VaultExplorerPluginSettings_1_29_0;
		const newData: VaultExplorerPluginSettings_1_30_5 = {
			...typedData,
			views: {
				...typedData.views,
				grid: {
					...typedData.views.grid,
					coverImageSource: "frontmatter-and-body",
				},
			},
		};

		return newData as unknown as Record<string, unknown>;
	}
}
