import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER || 'pokedex_user',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'pokedex_db',
    password: process.env.DB_PASSWORD || 'pokedex_pass',
    port: parseInt(process.env.DB_PORT || '5432', 10),
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

export const query = (text: string, params?: any[]) => {
    return pool.query(text, params);
};
