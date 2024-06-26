import { TMigration } from "./types";
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

export const migrations: TMigration[] = [
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
];
