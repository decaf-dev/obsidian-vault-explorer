import { TExplorerView, type VaultExplorerPluginSettings } from "src/types";
import type { VaultExplorerPluginSettings_1_45_0 } from "src/types/types-1.45.0";
import MigrationInterface from "./migration_interface";

export default class Migrate_1_46_0 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = data as unknown as VaultExplorerPluginSettings_1_45_0;

		const newData: VaultExplorerPluginSettings = {
			...typedData,
			views: {
				...typedData.views,
				grid: {
					...typedData.views.grid,
					isEnabled: true,
					order: 0,
				},
				list: {
					...typedData.views.list,
					isEnabled: true,
					order: 1,
				},
				feed: {
					...typedData.views.feed,
					isEnabled: true,
					order: 2,
				},
				table: {
					...typedData.views.table,
					isEnabled: true,
					order: 3,
				},
			},
			currentView: TExplorerView.GRID,
		};
		delete (newData as any).views.recommended;
		delete (newData as any).views.related;
		delete (newData as any).views.dashboard;
		delete (newData as any).viewOrder;
		return newData as unknown as Record<string, unknown>;
	}
}
