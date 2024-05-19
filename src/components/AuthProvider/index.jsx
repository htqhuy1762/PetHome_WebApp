// In AuthProvider.jsx
import { useState, useEffect, createContext } from 'react';
import * as authServices from '~/services/authServices';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [refreshingToken, setRefreshingToken] = useState(false);

    const refreshAccessToken = async () => {
        if (!refreshingToken) {
            setRefreshingToken(true);
            try {
                const response = await authServices.getNewAccessToken();
                const newToken = response.data.accessToken;
                const expiryTime = response.data.expiredIn;
                localStorage.setItem('accessToken', newToken);
                localStorage.setItem('expiredAt', expiryTime);
            } catch (error) {
                console.error('Failed to refresh access token', error);
            } finally {
                setRefreshingToken(false);
            }
        }
    };

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const expiredAt = localStorage.getItem('expiredAt');
        if (accessToken && new Date().getTime() < new Date(expiredAt).getTime()) {
            setIsLoggedIn(true);
        } else {
            refreshAccessToken();
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, refreshAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
}
