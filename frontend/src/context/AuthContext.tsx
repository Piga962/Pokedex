import { createContext } from 'react';

interface User {
    id: string;
    email: string;
}

export interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
