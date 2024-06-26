export default abstract class MigrationInterface {
	abstract migrate(previous: Record<string, unknown>): Record<string, unknown>;
}
