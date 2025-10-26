import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as favoritesModel from './favorites.model';

export const addFavoriteHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const { pokemonId, pokemonName } = req.body;
        if (!pokemonId || !pokemonName) {
            return res.status(400).json({ message: 'pokemonId and pokemonName are required' });
        }

        const newFavorite = await favoritesModel.addFavorite(userId, pokemonId, pokemonName);

        if (!newFavorite) {
            return res.status(500).json({ message: 'Failed to add favorite' });
        }
        res.status(201).json(newFavorite);
    } catch (error) {
        next(error);
    }
};

export const removeFavoriteHandler = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user!.id;
        const pokemonId = parseInt(req.params.pokemonId, 10);

        if (isNaN(pokemonId)) {
            return res.status(400).json({ message: 'Invalid pokemonId' });
        }

        const success = await favoritesModel.removeFavorite(userId, pokemonId);

        if (!success) {
            return res.status(404).json({ message: 'Favorite not found' });
        }
        res.status(200).json({ message: 'Favorite removed successfully' });
    } catch (error) {
        next(error);
    }
};

export const getFavoritesHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const favorites = await favoritesModel.findByUser(userId);
        res.status(200).json(favorites);
    } catch (error) {
        next(error);
    }
};
