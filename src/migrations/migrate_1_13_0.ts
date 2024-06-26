import { VaultExplorerPluginSettings_1_13_1 } from "src/types/types-1.13.1";
import MigrationInterface from "./migration_interface";
import { VaultExplorerPluginSettings_1_12_1 } from "src/types/types-1.12.1";

export default class Migrate_1_13_0 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = (data as unknown) as VaultExplorerPluginSettings_1_12_1;
		const newData: VaultExplorerPluginSettings_1_13_1 = {
			...typedData,
			views: {
				...typedData.views,
				enableClockUpdates: true
			},
			filters: {
				...typedData.filters,
				custom: {
					...typedData.filters.custom,
					groups: typedData.filters.custom.groups.map(group => {
						return {
							...group,
							isSticky: false
						}
					})
				}
			}
		}
		return newData as unknown as Record<string, unknown>;
	}
}
