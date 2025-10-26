import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../apiClient';
import { useState } from 'react';

interface PokemonListItem {
    id: number;
    name: string;
    imageUrl: string;
    types: string[];
}

interface PokemonCardProps {
    pokemon: PokemonListItem;
}

export const PokemonCard = ({ pokemon }: PokemonCardProps) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [addMessage, setAddMessage] = useState<string | null>(null);

    const handleAddFavorite = async () => {
        setAddMessage(null);

        if (!user) {
            navigate('/login');
            return;
        }

        try {
            console.log(pokemon.id, pokemon.name);
            await apiClient.post('/favorites', {
                pokemonId: pokemon.id,
                pokemonName: pokemon.name,
            });
            setAddMessage('Added to favorites!');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            if (error.response && error.response.status === 409) {
                setAddMessage('Already in favorites.');
            } else {
                setAddMessage('Failed to add favorite. Please try again.');
            }
        }

        setTimeout(() => setAddMessage(null), 3000);
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

            <button onClick={handleAddFavorite} style={{ marginTop: '10px' }}>
                Añadir a Favoritos
            </button>
            {addMessage && <p style={{ fontSize: '12px', marginTop: '5px' }}>{addMessage}</p>}
        </div>
    );
};
