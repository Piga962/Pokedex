import { useState, useEffect } from 'react';
import apiClient from '../apiClient';
import { PokemonCard } from '../components/PokemonCard';

interface PokemonListItem {
    id: number;
    name: string;
    imageUrl: string;
    types: string[];
}

interface PaginatedResponse {
    currentPage: number;
    totalPages: number;
    count: number;
    results: PokemonListItem[];
}

export const HomePage = () => {
    const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState<PokemonListItem | null>(null);
    const [searchError, setSearchError] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (searchResult) return;

        const fetchList = async () => {
            setIsLoading(true);
            setSearchError(null);
            try {
                const response = await apiClient.get<PaginatedResponse>('/pokemon', {
                    params: { page },
                });
                setPokemonList(response.data.results);
                setTotalPages(response.data.totalPages);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                console.error(error);
                setSearchError('Failed to load Pokémon list. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchList();
    }, [page, searchResult]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm) return;

        setIsLoading(true);
        setSearchError(null);
        setSearchResult(null);
        setPokemonList([]);

        try {
            const response = await apiClient.get<PokemonListItem>(
                `/pokemon/${searchTerm.toLowerCase()}`
            );
            setSearchResult(response.data);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                setSearchError('Pokémon not found. Please check the name or ID and try again.');
            } else {
                setSearchError('Failed to search for Pokémon. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
        setSearchResult(null);
        setSearchError(null);
        setPage(1);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Explorar Pokémon</h2>

            {/* --- Barra de Búsqueda --- */}
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nombre o ID"
                    style={{ padding: '8px', minWidth: '200px' }}
                />
                <button type="submit" style={{ padding: '8px' }}>
                    Buscar
                </button>
                {(searchResult || searchError) && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        style={{ padding: '8px', marginLeft: '5px' }}
                    >
                        Limpiar
                    </button>
                )}
            </form>

            <hr />

            {/* --- Contenedor de Resultados --- */}
            {isLoading && <div>Cargando...</div>}

            {searchError && <p style={{ color: 'red' }}>{searchError}</p>}

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {searchResult && <PokemonCard pokemon={searchResult} />}

                {!searchResult &&
                    pokemonList.map((pokemon) => (
                        <PokemonCard key={pokemon.id} pokemon={pokemon} />
                    ))}
            </div>

            {/* --- Controles de Paginación --- */}
            {!searchResult && !searchError && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        disabled={page === 1}
                    >
                        Anterior
                    </button>
                    <span style={{ margin: '0 15px' }}>
                        Página {page} de {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                        disabled={page === totalPages}
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
};
