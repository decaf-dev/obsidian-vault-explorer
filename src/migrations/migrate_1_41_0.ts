import { VaultExplorerPluginSettings } from "src/types";
import MigrationInterface from "./migration_interface";
import { VaultExplorerPluginSettings_1_40_2 } from "src/types/types-1.40.2";

export default class Migrate_1_41_0 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = data as unknown as VaultExplorerPluginSettings_1_40_2;
		const newData: VaultExplorerPluginSettings = {
			...typedData,
			properties: {
				...typedData.properties,
				coverImageFit: "",
			},
			views: {
				...typedData.views,
				grid: {
					...typedData.views.grid,
					coverImageFit: "cover",
				},
			},
		};

		return newData as unknown as Record<string, unknown>;
	}
}
