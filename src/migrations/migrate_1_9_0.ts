import MigrationInterface from "./migration_interface";
import { VaultExplorerPluginSettings_1_8_1 } from "src/types/types-1.8.1";
import { VaultExplorerPluginSettings_1_9_1 } from "src/types/types-1.9.1";

export default class Migrate_1_9_0 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = (data as unknown) as VaultExplorerPluginSettings_1_8_1;
		const newData: VaultExplorerPluginSettings_1_9_1 = {
			...typedData,
			filters: {
				...typedData.filters,
				custom: {
					selectedGroupId: typedData.filters.properties.selectedGroupId,
					groups: typedData.filters.properties.groups.map(group => {
						const rules = group.filters.map(filter => {
							return {
								...filter,
								valueData: "",
								type: filter.type as any
							}
						});
						return {
							...group,
							rules
						}
					})
				}
			}
		}
		delete (newData.filters as any).properties;
		for (const group of newData.filters.custom.groups as any) {
			delete group.filters;
		}
		return newData as unknown as Record<string, unknown>;
	}
}
