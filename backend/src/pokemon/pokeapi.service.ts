import axios from 'axios';
import { spec } from 'node:test/reporters';
import { types } from 'util';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

export interface PokemonDetail {
    id: number;
    name: string;
    imageUrl: string;
    types: string[];
    stats: { name: string; value: number }[];
    flavorText: string;
    evolutionChain: string[];
}

export interface PokemonListItem {
    id: number;
    name: string;
    imageUrl: string;
    types: string[];
}

export interface PaginatedPokemonResponse {
    currentPage: number;
    totalPages: number;
    count: number;
    results: PokemonListItem[];
}

const LIST_PAGE_SIZE = 20;

export const getPokemonDetails = async (
    nameOrId: string | number
): Promise<PokemonDetail | null> => {
    try {
        const lowerNameOrId = typeof nameOrId === 'string' ? nameOrId.toLowerCase() : nameOrId;
        const mainResponse = await axios.get(`${POKEAPI_BASE_URL}/pokemon/${lowerNameOrId}`);
        const pokemonData = mainResponse.data as any;

        const speciesResponse = await axios.get(pokemonData.species.url);
        const speciesData = speciesResponse.data as any;

        const evolutionResponse = await axios.get(speciesData.evolution_chain.url);
        const evolutionData = evolutionResponse.data as any;

        const types = pokemonData.types.map((t: any) => t.type.name);
        const stats = pokemonData.stats.map((s: any) => ({
            name: s.stat.name,
            value: s.base_stat,
        }));

        const imageUrl =
            pokemonData.sprites.other['official-artwork']?.front_default ||
            pokemonData.sprites.front_default;
        const flavorText = findEnglishFlavorText(speciesData.flavor_text_entries);
        const evolution_chain = parseEvolutionChain(evolutionData.chain);

        const pokemonDetail: PokemonDetail = {
            id: pokemonData.id,
            name: pokemonData.name,
            imageUrl: imageUrl,
            types: types,
            stats: stats,
            flavorText: flavorText,
            evolutionChain: evolution_chain,
        };
        return pokemonDetail;
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        console.error('Error fetching Pokémon details:', error);
        throw new Error('Failed to fetch Pokémon details');
    }
};

const findEnglishFlavorText = (entries: any[]): string => {
    const entry = entries.find((e: any) => e.language.name === 'en');
    return entry ? entry.flavor_text.replace(/[\n\f\r]/g, ' ') : 'No flavor text available.';
};

const parseEvolutionChain = (chain: any): string[] => {
    const evolutions: string[] = [];
    let current = chain;

    do {
        evolutions.push(current.species.name);
        current = current.evolves_to[0];
    } while (current && current.evolves_to.length > 0);

    if (current) {
        evolutions.push(current.species.name);
    }

    return evolutions;
};

export const getPokemonList = async (page: number): Promise<PaginatedPokemonResponse | null> => {
    try {
        const offset = (page - 1) * LIST_PAGE_SIZE;
        const listResponse = await axios.get(`${POKEAPI_BASE_URL}/pokemon`, {
            params: {
                limit: LIST_PAGE_SIZE,
                offset: offset,
            },
        });

        const listResults = (listResponse.data as any).results;
        const totalCount = (listResponse.data as any).count;
        const totalPages = Math.ceil(totalCount / LIST_PAGE_SIZE);

        const detailPromises = listResults.map((p: any) => getSimplePokemonDetails(p.url));
        const detailedResults = await Promise.all(detailPromises);

        return {
            currentPage: page,
            totalPages: totalPages,
            count: totalCount,
            results: detailedResults,
        };
    } catch (error) {
        console.error('Error fetching Pokémon list:', error);
        throw new Error('Failed to fetch Pokémon list');
    }
};

const getSimplePokemonDetails = async (url: string): Promise<PokemonListItem> => {
    try {
        const response = await axios.get(url);
        const data = response.data as any;

        return {
            id: data.id,
            name: data.name,
            imageUrl:
                data.sprites.other['official-artwork']?.front_default || data.sprites.front_default,
            types: data.types.map((t: any) => t.type.name),
        };
    } catch (error) {
        console.error('Error fetching simple Pokémon details:', error);
        return {
            id: 0,
            name: 'Error',
            imageUrl: '',
            types: [],
        };
    }
};

export const getPokemonByType = async (typeName: string): Promise<PokemonListItem[]> => {
    try {
        const lowerTypeName = typeName.toLowerCase();

        const typeResponse = await axios.get(`${POKEAPI_BASE_URL}/type/${lowerTypeName}`);
        const pokemonList = (typeResponse.data as any).pokemon;

        const detailPromises = pokemonList.map((p: any) => getSimplePokemonDetails(p.pokemon.url));
        const detailedResults = await Promise.all(detailPromises);

        return detailedResults;
    } catch (error) {
        console.error('Error fetching Pokémon by type:', error);
        throw new Error('Failed to fetch Pokémon by type');
    }
};
