import { FilterRuleType, VaultExplorerPluginSettings_1_12_1 } from "src/types/types-1.12.1";
import MigrationInterface from "./migration_interface";
import { VaultExplorerPluginSettings_1_9_1 } from "src/types/types-1.9.1";

export default class Migrate_1_10_0 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = (data as unknown) as VaultExplorerPluginSettings_1_9_1;
		const newData: VaultExplorerPluginSettings_1_12_1 = {
			...typedData,
			filters: {
				...typedData.filters,
				custom: {
					...typedData.filters.custom,
					groups: typedData.filters.custom.groups.map(group => {
						const rules = group.rules.map(rule => {
							return {
								...rule,
								type: FilterRuleType.PROPERTY as any,
								propertyType: rule.type as any,
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
		delete (newData.filters as any).folder;
		delete (newData.filters as any).properties;
		for (const group of newData.filters.custom.groups as any) {
			delete group.filters;
		}
		return newData as unknown as Record<string, unknown>;
	}
}
