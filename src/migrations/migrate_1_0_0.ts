import { VaultExplorerPluginSettings_0_5_5 } from "src/types/types-0.5.5";
import MigrationInterface from "./migration_interface";
import { VaultExplorerPluginSettings_1_0_1 } from "src/types/types-1.0.1";
import { LOG_LEVEL_WARN } from "src/logger/constants";

export default class Migrate_1_0_0 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = (data as unknown) as VaultExplorerPluginSettings_0_5_5;
		const newData: VaultExplorerPluginSettings_1_0_1 = {
			...typedData,
			logLevel: LOG_LEVEL_WARN,
			filters: {
				...typedData.filters,
				properties: {
					...typedData.filters.properties,
					groups: typedData.filters.properties.groups.map(group => {
						const { id, name, filters, isEnabled } = group;
						return {
							id,
							name,
							filters,
							isEnabled
						}
					})
				}
			}
		}
		return newData as unknown as Record<string, unknown>;
	}
}
