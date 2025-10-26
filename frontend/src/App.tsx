import './App.css';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { useAuth } from './hooks/useAuth';
import apiClient from './apiClient';

function App() {
    const { user, isLoading, setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await apiClient.post('/auth/logout');
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            setUser(null);
            navigate('/login');
        }
    };

    if (isLoading) {
        return <div>Cargando sesión...</div>;
    }

    return (
        <div>
            <nav>
                <Link to="/">Home</Link> |
                {user ? (
                    <>
                        <Link to="/favorites">Mis Favoritos</Link>
                        {' | '}
                        <button
                            onClick={handleLogout}
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                color: 'blue',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                            }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </nav>

            <hr />

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {user ? (
                    <Route path="/favorites" element={<FavoritesPage />} />
                ) : (
                    <Route path="/favorites" element={<LoginPage />} />
                )}
            </Routes>
        </div>
    );
}

export default App;
