import License from "src/svelte/shared/services/license";
import MigrationInterface from "./migration_interface";

export default class Migrate_1_17_2 implements MigrationInterface {
	migrate(data: Record<string, unknown>) {
		License.getInstance().setStoredDeviceRegistered(false);
		return data as unknown as Record<string, unknown>;
	}
}
