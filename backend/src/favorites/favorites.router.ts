import { Router } from 'express';
import * as favoritesController from './favorites.controller';
import { authMiddleware } from '../middleware/auth';
const router = Router();

router.use(authMiddleware);

router.post('/', favoritesController.addFavoriteHandler);
router.delete('/:pokemonId', favoritesController.removeFavoriteHandler);
router.get('/', favoritesController.getFavoritesHandler);

export default router;
