"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shorthand = void 0;
exports.up = up;
exports.down = down;
/* Define table and columns type */
exports.shorthand = {
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
const createTrigger = (tableName) => `
CREATE TRIGGER set_${tableName}_updated_at
BEFORE UPDATE ON ${tableName}
FOR EACH ROW
EXECUTE PROCEDURE ${TRIGGER_FUNCTION_NAME}();
`;
/* Migration up function */
async function up(pgm) {
    pgm.createTable('users', exports.shorthand);
    await pgm.sql(TRIGGER_FUNCTION);
    await pgm.sql(createTrigger('users'));
}
/* Migration down function (rollback) */
async function down(pgm) {
    await pgm.sql(`DROP TRIGGER IF EXISTS update_users_updated_at ON "users";`);
    await pgm.sql(`DROP FUNCTION IF EXISTS ${TRIGGER_FUNCTION_NAME}();`);
    pgm.dropTable('users');
}
