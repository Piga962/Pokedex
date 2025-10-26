import apiClient from '../apiClient';

interface PokemonListItem {
    id: number;
    name: string;
    imageUrl: string;
    types: string[];
}

interface FavoriteCardProps {
    pokemon: PokemonListItem;
    onRemove: (id: number) => void;
}

export const FavoritePokemonCard = ({ pokemon, onRemove }: FavoriteCardProps) => {
    const handleRemoveFavorite = async () => {
        if (!confirm(`Are you sure you want to remove ${pokemon.name} from your favorites?`)) {
            return;
        }

        try {
            await apiClient.delete(`/favorites/${pokemon.id}`);
            onRemove(pokemon.id);
        } catch (error) {
            console.error('Failed to remove favorite:', error);
            alert('Failed to remove favorite. Please try again.');
        }
    };

    return (
        <div
            style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '16px',
                margin: '8px',
                width: '200px',
                textAlign: 'center',
            }}
        >
            <img
                src={pokemon.imageUrl}
                alt={pokemon.name}
                style={{ width: '150px', height: '150px' }}
            />
            <h3>{pokemon.name}</h3>
            <div>{pokemon.types.join(', ')}</div>

            <button
                onClick={handleRemoveFavorite}
                style={{ marginTop: '10px', backgroundColor: '#f44336', color: 'white' }}
            >
                Eliminar
            </button>
        </div>
    );
};
