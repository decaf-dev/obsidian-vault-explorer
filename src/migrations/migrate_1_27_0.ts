import MigrationInterface from "./migration_interface";
import { VaultExplorerPluginSettings_1_26_3 } from "src/types/types-1.26.3";
import { VaultExplorerPluginSettings_1_28_0 } from "src/types/types-1.28.0";

export default class Migrate_1_27_0 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = data as unknown as VaultExplorerPluginSettings_1_26_3;
		const newData: VaultExplorerPluginSettings_1_28_0 = {
			...typedData,
			views: {
				...typedData.views,
				feed: {
					...typedData.views.feed,
					removeH1: true,
					collapseStyle: "no-new-lines",
					lineClampLarge: 5,
					lineClampMedium: 3,
					lineClampSmall: 2,
				},
			},
		};

		delete (newData as any).views.feed.collapseContent;

		return newData as unknown as Record<string, unknown>;
	}
}
