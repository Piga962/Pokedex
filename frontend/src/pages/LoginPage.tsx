import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../apiClient';
import { useNavigate, Link } from 'react-router-dom';
import { AxiosError } from 'axios';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { setUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await apiClient.post('/auth/login', { email, password });
            setUser(response.data.user);
            navigate('/');
        } catch (err) {
            const axiosError = err as AxiosError<{ message: string }>;
            if (axiosError.response) {
                setError(axiosError.response.data.message || 'Login failed. Please try again.');
            } else {
                setError('Network error. Please check your connection and try again.');
            }
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '40px auto' }}>
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="email" style={{ display: 'block' }}>
                        Email:
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="password" style={{ display: 'block' }}>
                        Password:
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px 15px' }}>
                    Login
                </button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <p>
                ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
            </p>
        </div>
    );
};
