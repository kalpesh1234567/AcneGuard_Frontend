import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BASE_URL, TOKEN_KEY, USER_KEY } from '../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const validateToken = async () => {
            const storedToken = localStorage.getItem(TOKEN_KEY);
            if (!storedToken) { setLoading(false); return; }
            try {
                const res = await axios.get(`${BASE_URL}/auth/me`, {
                    headers: { Authorization: `Bearer ${storedToken}` },
                });
                setUser(res.data);
                setToken(storedToken);
            } catch {
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(USER_KEY);
                setUser(null);
                setToken(null);
            } finally {
                setLoading(false);
            }
        };
        validateToken();
    }, []);

    const login = useCallback((tokenValue, userData) => {
        localStorage.setItem(TOKEN_KEY, tokenValue);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        setToken(tokenValue);
        setUser(userData);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
    }, []);

    const getAuthHeader = useCallback(() =>
        token ? { Authorization: `Bearer ${token}` } : {},
        [token]);

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, getAuthHeader }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
};
