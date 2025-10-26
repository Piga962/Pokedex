import { Request, Response, NextFunction } from 'express';
import * as pokeapiService from '../pokemon/pokeapi.service';

export const getPokemonDetailHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { nameOrId } = req.params;
        const pokemonDetail = await pokeapiService.getPokemonDetails(nameOrId);

        if (!pokemonDetail) {
            return res.status(404).json({ message: 'Pokemon not found' });
        }
        return res.status(200).json(pokemonDetail);
    } catch (error) {
        next(error);
    }
};

export const getPokemonListHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string, 10) || 1;
        if (page < 1) {
            return res.status(400).json({ message: 'Page number must be greater than 0' });
        }

        const listData = await pokeapiService.getPokemonList(page);

        if (!listData) {
            return res.status(404).json({ message: 'No Pokémon found' });
        }
        return res.status(200).json(listData);
    } catch (error) {
        next(error);
    }
};

export const getPokemonByTypeHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { typeName } = req.params;
        const pokemonList = await pokeapiService.getPokemonByType(typeName);

        res.status(200).json(pokemonList);
    } catch (error) {
        next(error);
    }
};
