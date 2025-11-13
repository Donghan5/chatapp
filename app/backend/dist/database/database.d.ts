import { QueryResult } from 'pg';
import { User } from '@chatapp/common-types';
export declare function initializeSchema(): Promise<void>;
export declare function runDatabase(query: string, params?: any[]): Promise<QueryResult>;
export declare function insertLocalUser(name: string, email: string, passwordHash: string): Promise<User>;
export declare function insertGoogleUser(name: string, email: string, picture: string): Promise<User>;
export declare function dbFindById(id: number): Promise<User | undefined>;
export declare function dbFindByEmail(email: string): Promise<User | undefined>;
