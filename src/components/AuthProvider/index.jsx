import { useState, useEffect, createContext } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const accessToken = localStorage.getItem('accessToken');
    const expiredAt = localStorage.getItem('expiredAt');
    useEffect(() => {
        const checkLoginStatus = () => {
            if (accessToken && new Date().getTime() < new Date(expiredAt).getTime()) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
            setIsLoading(false);
        };

        // Check initial login status
        checkLoginStatus();

    }, [accessToken, expiredAt]);

    return <AuthContext.Provider value={{ isLoggedIn, isLoading, setIsLoggedIn }}>{children}</AuthContext.Provider>;
}
