import { Pool, PoolClient, QueryResult } from 'pg';
import { User } from '@chatapp/common-types';

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: Number(process.env.DB_PORT) || 5432,
});

console.log('Database pool created');

/* Initialize database schema */
export async function initializeSchema() {
	const createTableQuery = `
	CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		name VARCHAR(100),
		email VARCHAR(100) UNIQUE NOT NULL,
		picture VARCHAR(255),
		profile_completed BOOLEAN DEFAULT FALSE,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	);
	`;

	await runDatabase(createTableQuery);
	console.log('Database schema initialized (if not exists)');
}

/* Execute a database query */
export async function runDatabase(query: string, params: any[] = []): Promise<any[]> {
	try {
		const result: QueryResult = await pool.query(query, params);
		return result.rows;
	} catch (error) {
		console.error('Error executing query:', error);
		throw error;
	}
}

export async function insertLocalUser(name: string, email: string, passwordHash: string): Promise<User> {
	const query = `
		INSERT INTO users (name, email, password_hash) 
		VALUES ($1, $2, $3) 
		RETURNING *;
	`;
	const params = [name, email, passwordHash];
	try {
		const rows = await runDatabase(query, params);
		console.log('Local user inserted with ID:', rows[0].id);
		return rows[0];
	} catch (error) {
		console.error('Error inserting local user:', error);
		throw error;
	}
}

export async function insertGoogleUser(name: string, email: string, picture: string): Promise<User> {
	const query = `
		INSERT INTO users (name, email, picture) 
		VALUES ($1, $2, $3) 
		RETURNING *;
	`;
	const params = [name, email, picture];
	try {
		const rows = await runDatabase(query, params);
		console.log('Google user inserted with ID:', rows[0].id);
		return rows[0];
	} catch (error) {
		console.error('Error inserting google user:', error);
		throw error;
	}
}

export async function dbFindById(id: number): Promise<User | undefined> {
	const query = 'SELECT * FROM users WHERE id = $1';
	const params = [id];
	const rows = await runDatabase(query, params);
	return rows[0];
}

export async function dbFindByEmail(email: string): Promise<User | undefined> {
	const query = 'SELECT * FROM users WHERE email = $1';
	const params = [email];
	const rows = await runDatabase(query, params);
	return rows[0];
}