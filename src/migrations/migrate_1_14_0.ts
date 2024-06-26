import { VaultExplorerPluginSettings_1_14_2 } from "src/types/types-1.14.2";
import MigrationInterface from "./migration_interface";
import { VaultExplorerPluginSettings_1_13_1 } from "src/types/types-1.13.1";

export default class Migrate_1_14_0 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = (data as unknown) as VaultExplorerPluginSettings_1_13_1;
		const newData: VaultExplorerPluginSettings_1_14_2 = {
			...typedData,
			filters: {
				...typedData.filters,
				search: {
					isEnabled: true,
					value: typedData.filters.search
				},
				favorites: {
					isEnabled: true,
					value: typedData.filters.onlyFavorites
				},
				timestamp: {
					isEnabled: true,
					value: typedData.filters.timestamp
				},
				sort: {
					isEnabled: true,
					value: typedData.filters.sort
				},
				custom: {
					isEnabled: true,
					...typedData.filters.custom
				},
			},
			enableScrollButtons: true,
		}
		delete (newData.filters as any).onlyFavorites;
		return newData as unknown as Record<string, unknown>;
	}
}
