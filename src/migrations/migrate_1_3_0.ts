import MigrationInterface from "./migration_interface";
import { VaultExplorerPluginSettings_1_2_1 } from "src/types/types-1.2.1";
import { PropertyFilterGroup_1_5_0, PropertyFilter_1_5_0, VaultExplorerPluginSettings_1_5_0 } from "src/types/types-1.5.0";

export default class Migrate_1_3_0 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = (data as unknown) as VaultExplorerPluginSettings_1_2_1;
		const groups = typedData.filters.properties.groups;

		const updatedGroups: PropertyFilterGroup_1_5_0[] = groups.map(group => {
			const updatedFilters: PropertyFilter_1_5_0[] = group.filters.map(filter => {
				return {
					...filter,
					type: filter.type as any,
					matchWhenPropertyDNE: false
				}
			});
			return {
				...group,
				filters: updatedFilters
			}
		});

		const newData: VaultExplorerPluginSettings_1_5_0 = {
			...typedData,
			filters: {
				...typedData.filters,
				properties: {
					...typedData.filters.properties,
					groups: updatedGroups,
				}
			}
		}
		return newData as unknown as Record<string, unknown>;
	}
}
