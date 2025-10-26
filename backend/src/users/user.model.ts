import { query } from '../db/database';

export interface User {
    id: string;
    email: string;
    password: string;
    created_at: Date;
    update_at: Date;
}

export const findByEmail = async (email: string): Promise<User | null> => {
    const sql = 'SELECT * FROM users WHERE email = $1';
    try {
        const result = await query(sql, [email]);
        if (result.rows.length > 0) {
            const { password, ...user } = result.rows[0];
            return { ...user, password: password };
        }
        return null;
    } catch (error) {
        console.error('Error finding user by email:', error);
        throw new Error('Database error');
    }
};

export const create = async (
    email: string,
    hashedPassword: string
): Promise<Omit<User, 'password_hash'>> => {
    const sql =
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, created_at, updated_at';
    try {
        const result = await query(sql, [email, hashedPassword]);
        return result.rows[0];
    } catch (error) {
        console.error('Error creating user: ', error);
        throw new Error('Database error');
    }
};

export const findById = async (id: string): Promise<User | null> => {
    const sql = 'SELECT id, email, created_at, updated_at FROM users WHERE id = $1';
    try {
        const result = await query(sql, [id]);
        if (result.rows.length > 0) {
            return result.rows[0];
        }
        return null;
    } catch (error) {
        console.error('Error finding user by id:', error);
        throw new Error('Database error');
    }
};
