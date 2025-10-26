import { query } from '../db/database';

export interface Favorite {
    id: string;
    user_id: string;
    pokemon_id: number;
    pokemon_name: string;
    created_at: Date;
}

export const addFavorite = async (
    userId: string,
    pokemonId: number,
    pokemoName: string
): Promise<Favorite | null> => {
    const sql =
        'INSERT INTO favorites (user_id, pokemon_id, pokemon_name) VALUES ($1, $2, $3) ON CONFLICT (user_id, pokemon_id) DO NOTHING RETURNING *';
    try {
        const result = await query(sql, [userId, pokemonId, pokemoName]);
        if (result.rows.length > 0) {
            return result.rows[0];
        }
        return null;
    } catch (error) {
        console.error('Error adding favorite:', error);
        return null;
    }
};

export const removeFavorite = async (userId: string, pokemonId: number): Promise<boolean> => {
    const sql = 'DELETE FROM favorites WHERE user_id = $1 AND pokemon_id = $2';
    try {
        const result = await query(sql, [userId, pokemonId]);
        return (result.rowCount ?? 0) > 0;
    } catch (error) {
        console.error('Error removing favorite:', error);
        return false;
    }
};

export const findByUser = async (userId: string): Promise<Favorite[]> => {
    const sql = 'SELECT * FROM favorites WHERE user_id = $1 ORDER BY created_at DESC';
    try {
        const result = await query(sql, [userId]);
        return result.rows;
    } catch (error) {
        console.error('Error finding favorites by user:', error);
        return [];
    }
};
