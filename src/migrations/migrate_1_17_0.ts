import { TExplorerView } from "src/types";
import MigrationInterface from "./migration_interface";
import { VaultExplorerPluginSettings_1_16_0 } from "src/types/types-1.16.0";
import { VaultExplorerPluginSettings_1_20_0 } from "src/types/types-1.20.0";

export default class Migrate_1_17_0 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		const typedData = data as unknown as VaultExplorerPluginSettings_1_16_0;
		const newData: VaultExplorerPluginSettings_1_20_0 = {
			...typedData,
			views: {
				dashboard: {
					isEnabled: false,
				},
				grid: {
					isEnabled: true,
				},
				list: {
					isEnabled: true,
				},
				table: {
					isEnabled: false,
				},
				feed: {
					isEnabled: true,
				},
				recommended: {
					isEnabled: false,
				},
				related: {
					isEnabled: false,
				},
			},
			viewOrder: typedData.views.order as unknown as TExplorerView[],
			enableClockUpdates: typedData.views.enableClockUpdates,
			currentView: typedData.views
				.currentView as unknown as TExplorerView,
			titleWrapping: typedData.views.titleWrapping,
		};
		delete (newData as any).views.order;
		delete (newData as any).views.currentView;
		delete (newData as any).views.enableClockUpdates;
		delete (newData as any).views.titleWrapping;
		return newData as unknown as Record<string, unknown>;
	}
}
