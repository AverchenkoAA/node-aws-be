import { ClientConfig } from 'pg';
export const dbOptions: ClientConfig = {
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: +process.env.PG_PORT!,
    ssl: {
        rejectUnauthorized: false
    },
    connectionTimeoutMillis: 5000
};
