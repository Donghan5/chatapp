import 'dotenv/config';
import { DataSource } from "typeorm";
import path from "path";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "127.0.0.1",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "chatapp_db",
    synchronize: false,
    logging: true,
    entities: [path.join(process.cwd(), "src/entity/*.ts")],
    migrations: [path.join(process.cwd(), "src/migrations/*.ts")],
});