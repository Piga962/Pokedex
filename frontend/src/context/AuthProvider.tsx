import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import apiClient from '../apiClient';
import { AuthContext } from './AuthContext';

interface User {
    id: string;
    email: string;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const response = await apiClient.get<User>('auth/me');
                setUser(response.data);
            } catch (error) {
                console.error('No authenticated user', error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, isLoading }}>{children}</AuthContext.Provider>
    );
};
