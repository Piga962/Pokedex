import { useState, useEffect } from 'react';
import apiClient from '../apiClient';
import { FavoritePokemonCard } from '../components/FavoritePokemonCard';

interface Favorite {
    id: string;
    user_id: string;
    pokemon_id: number;
    pokemon_name: string;
    created_at: Date;
}

interface PokemonListItem {
    id: number;
    name: string;
    imageUrl: string;
    types: string[];
}

export const FavoritesPage = () => {
    const [favoriteDetails, setFavoriteDetails] = useState<PokemonListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFavorites = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const favListResponse = await apiClient.get<Favorite[]>('/favorites');
            const favoritesList = favListResponse.data;

            if (favoritesList.length === 0) {
                setFavoriteDetails([]);
                setIsLoading(false);
                return;
            }

            const detailPromises = favoritesList.map((fav) =>
                apiClient.get<PokemonListItem>(`/pokemon/${fav.pokemon_id}`)
            );

            const detailResponse = await Promise.all(detailPromises);
            const details = detailResponse.map((res) => res.data);
            setFavoriteDetails(details);
        } catch (error) {
            console.error('Failed to fetch favorites:', error);
            setError('Failed to load favorites. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    const handleRemove = (removeId: number) => {
        setFavoriteDetails((currentDetails) => currentDetails.filter((p) => p.id !== removeId));
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Favorite Pokémon</h2>

            {isLoading && <div>Loading favorites...</div>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!isLoading && favoriteDetails.length === 0 && (
                <p>You don't have any favorite Pokémon saved.</p>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {favoriteDetails.map((pokemon) => (
                    <FavoritePokemonCard
                        key={pokemon.id}
                        pokemon={pokemon}
                        onRemove={handleRemove}
                    />
                ))}
            </div>
        </div>
    );
};
