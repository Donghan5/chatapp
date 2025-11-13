import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';
export declare const shorthand: ColumnDefinitions | undefined;
export declare function up(pgm: MigrationBuilder): Promise<void>;
export declare function down(pgm: MigrationBuilder): Promise<void>;
