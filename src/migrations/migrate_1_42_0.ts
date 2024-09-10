import { VaultExplorerPluginSettings } from "src/types";
import MigrationInterface from "./migration_interface";
import { VaultExplorerPluginSettings_1_41_1 } from "src/types/types-1.41.1";

export default class Migrate_1_42_0 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = data as unknown as VaultExplorerPluginSettings_1_41_1;
		const newData: VaultExplorerPluginSettings = {
			...typedData,
			properties: {
				...typedData.properties,
				image: typedData.properties.image || "image",
				coverImageFit:
					typedData.properties.coverImageFit || "image-fit",
				url: typedData.properties.url || "url",
			},
		};
		delete (newData as any).filterGroupsWidth;
		delete (newData as any).shouldWrapFilterGroups;
		delete (newData as any).filters.favorites;
		delete (newData as any).filters.timestamp;

		return newData as unknown as Record<string, unknown>;
	}
}
