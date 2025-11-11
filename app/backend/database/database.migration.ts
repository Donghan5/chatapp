import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

/* Define table and columns type */
export const shorthand: ColumnDefinitions | undefined = {
	id: { type: 'serial', primaryKey: true },
	name: { type: 'varchar(100)' },
	email: { type: 'varchar(100)', notNull: true, unique: true },
	picture: { type: 'varchar(255)' },
	profile_completed: { type: 'boolean', default: false },
	created_at: { type: 'timestamp', default: { raw: 'CURRENT_TIMESTAMP' } },
	updated_at: {
		type: 'timestamp',
		default: { raw: 'CURRENT_TIMESTAMP' },
	},
};

const TRIGGER_FUNCTION_NAME = 'set_updated_at';
const TRIGGER_FUNCTION = `
CREATE OR REPLACE FUNCTION ${TRIGGER_FUNCTION_NAME}()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = CURRENT_TIMESTAMP;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;
`;

const createTrigger = (tableName: string) => `
CREATE TRIGGER set_${tableName}_updated_at
BEFORE UPDATE ON ${tableName}
FOR EACH ROW
EXECUTE PROCEDURE ${TRIGGER_FUNCTION_NAME}();
`;


/* Migration up function */
export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable('users', shorthand);

	await pgm.sql(TRIGGER_FUNCTION);

	await pgm.sql(createTrigger('users'));
}

/* Migration down function (rollback) */
export async function down(pgm: MigrationBuilder): Promise<void> {
	await pgm.sql(`DROP TRIGGER IF EXISTS update_users_updated_at ON "users";`);

	await pgm.sql(`DROP FUNCTION IF EXISTS ${TRIGGER_FUNCTION_NAME}();`);
	
	pgm.dropTable('users');
}
