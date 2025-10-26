import { Router } from 'express';
import * as pokemonController from './pokemon.controller';

const router = Router();

router.get('/:nameOrId', pokemonController.getPokemonDetailHandler);
router.get('/type/:typeName', pokemonController.getPokemonByTypeHandler);
router.get('/', pokemonController.getPokemonListHandler);

export default router;
