import MigrationInterface from "./migration_interface";

export interface TMigration {
	from: string;
	to: string;
	migrate: new () => MigrationInterface;
}
