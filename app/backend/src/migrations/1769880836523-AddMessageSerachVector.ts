import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMessageSerachVector1769880836523 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        // add column search_vector to messages table
        await queryRunner.query(`
            ALTER TABLE messages
            ADD COLUMN IF NOT EXISTS search_vector tsvector;
        `);

        // Populate existing data
        await queryRunner.query(`
            UPDATE messages
            SET search_vector = to_tsvector('english', content);
        `);

        // Create GIN index
        await queryRunner.query(`
            CREATE INDEX idx_messages_search ON messages USING GIN (search_vector);
        `);

        // Create trigger function
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION messages_search_trigger()
            RETURNS trigger AS $$
            BEGIN
                NEW.search_vector := to_tsvector('english', NEW.content);
                RETURN NEW;
            END
            $$ LANGUAGE plpgsql
        `);

        // Create trigger
        await queryRunner.query(`
            DROP TRIGGER IF EXISTS tsvector_update ON messages;
            CREATE TRIGGER tsvector_update
            BEFORE INSERT OR UPDATE ON messages
            FOR EACH ROW EXECUTE FUNCTION messages_search_trigger()         
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TRIGGER IF EXISTS tsvector_update ON messages`);
        await queryRunner.query(`DROP FUNCTION IF EXISTS messages_search_trigger()`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_messages_search`);
        await queryRunner.query(`ALTER TABLE messages DROP COLUMN IF EXISTS search_vector`);
    }

}
