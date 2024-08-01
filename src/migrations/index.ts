import Migrate_0_4_0 from "./migrate_0_4_0";
import Migrate_1_1_0 from "./migrate_1_1_0";
import Migrate_1_0_0 from "./migrate_1_0_0";
import Migrate_1_2_1 from "./migrate_1_2_1";
import Migrate_1_3_0 from "./migrate_1_3_0";
import Migrate_1_6_0 from "./migrate_1_6_0";
import Migrate_1_6_1 from "./migrate_1_6_1";
import Migrate_1_9_0 from "./migrate_1_9_0";
import Migrate_1_14_0 from "./migrate_1_14_0";
import Migrate_1_15_0 from "./migrate_1_15_0";
import Migrate_1_17_0 from "./migrate_1_17_0";
import Migrate_1_13_0 from "./migrate_1_13_0";
import Migrate_1_10_0 from "./migrate_1_10_0";
import Migrate_1_21_0 from "./migrate_1_21_0";
import Migrate_1_22_0 from "./migrate_1_22_0";
import Migrate_1_23_0 from "./migrate_1_23_0";
import Migrate_1_23_1 from "./migrate_1_23_1";
import Migrate_1_24_0 from "./migrate_1_24_0";
import Migrate_1_25_0 from "./migrate_1_25_0";
import Migrate_1_26_0 from "./migrate_1_26_0";

import { TMigration } from "./types";
import { isVersionLessThan } from "src/utils";
import Migrate_1_27_0 from "./migrate_1_27_0";
import Migrate_1_29_0 from "./migrate_1_29_0";
import Migrate_1_30_0 from "./migrate_1_30_5";
import Migrate_1_31_0 from "./migrate_1_31_0";
import Migrate_1_33_0 from "./migrate_1_33_0";
import Migrate_1_37_0 from "./migrate_1_37_0";
import Migrate_1_38_0 from "./migrate_1_38_0";

const migrations: TMigration[] = [
	{
		from: "0.3.3",
		to: "0.4.0",
		migrate: Migrate_0_4_0,
	},
	{
		from: "0.5.5",
		to: "1.0.0",
		migrate: Migrate_1_0_0,
	},
	{
		from: "1.0.1",
		to: "1.1.0",
		migrate: Migrate_1_1_0,
	},
	{
		from: "1.2.0",
		to: "1.2.1",
		migrate: Migrate_1_2_1,
	},
	{
		from: "1.2.1",
		to: "1.3.0",
		migrate: Migrate_1_3_0,
	},
	{
		from: "1.5.0",
		to: "1.6.0",
		migrate: Migrate_1_6_0,
	},
	{
		from: "1.6.0",
		to: "1.6.1",
		migrate: Migrate_1_6_1,
	},
	{
		from: "1.8.1",
		to: "1.9.0",
		migrate: Migrate_1_9_0,
	},
	{
		from: "1.9.1",
		to: "1.10.0",
		migrate: Migrate_1_10_0,
	},
	{
		from: "1.12.1",
		to: "1.13.0",
		migrate: Migrate_1_13_0,
	},
	{
		from: "1.13.1",
		to: "1.14.0",
		migrate: Migrate_1_14_0,
	},
	{
		from: "1.14.2",
		to: "1.15.0",
		migrate: Migrate_1_15_0,
	},
	{
		from: "1.16.0",
		to: "1.17.0",
		migrate: Migrate_1_17_0,
	},
	{
		from: "1.20.0",
		to: "1.21.0",
		migrate: Migrate_1_21_0,
	},
	{
		from: "1.21.2",
		to: "1.22.0",
		migrate: Migrate_1_22_0,
	},
	{
		from: "1.22.0",
		to: "1.23.0",
		migrate: Migrate_1_23_0,
	},
	{
		from: "1.23.0",
		to: "1.23.1",
		migrate: Migrate_1_23_1,
	},
	{
		from: "1.23.2",
		to: "1.24.0",
		migrate: Migrate_1_24_0,
	},
	{
		from: "1.24.2",
		to: "1.25.0",
		migrate: Migrate_1_25_0,
	},
	{
		from: "1.25.2",
		to: "1.26.0",
		migrate: Migrate_1_26_0,
	},
	{
		from: "1.26.3",
		to: "1.27.0",
		migrate: Migrate_1_27_0,
	},
	{
		from: "1.28.0",
		to: "1.29.0",
		migrate: Migrate_1_29_0,
	},
	{
		from: "1.29.0",
		to: "1.30.0",
		migrate: Migrate_1_30_0,
	},
	{
		from: "1.30.5",
		to: "1.31.0",
		migrate: Migrate_1_31_0,
	},
	{
		from: "1.32.2",
		to: "1.33.0",
		migrate: Migrate_1_33_0,
	},
	{
		from: "1.36.3",
		to: "1.37.0",
		migrate: Migrate_1_37_0,
	},
	{
		from: "1.37.2",
		to: "1.38.0",
		migrate: Migrate_1_38_0,
	},
];

export const preformMigrations = (
	settingsVersion: string,
	data: Record<string, unknown>
) => {
	let updatedData = structuredClone(data);

	for (const migration of migrations) {
		const { from, to } = migration;
		if (isVersionLessThan(settingsVersion, to)) {
			console.log(`Upgrading settings from version ${from} to ${to}`);
			const migrator = new migration.migrate();
			const newData = migrator.migrate(updatedData);
			updatedData = newData;
		}
	}

	return updatedData;
};
