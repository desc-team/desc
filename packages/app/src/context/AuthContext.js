import React, { useContext, useEffect, useState } from 'react';
import { fetchSessionUser } from '../services/auth';

const AuthContext = React.createContext({
    contextUser: null,
    token: '', //jwt
    isFetchingToken: true,
    login: () => {},
    logout: () => {}
});

const AuthConsumer = AuthContext.Consumer;

function AuthProvider({ children }) {
    const [contextUser, setContextUser] = useState(null);
    const [token, setToken] = useState('');
    const [isFetchingToken, setIsFetchingToken] = useState(true);

    useEffect(() => {
        fetchSessionUser().then((data) => {
            if (data && data.payload) {
                setContextUser(data.payload.user);
                setToken(data.payload.accessToken);
            }

            setTimeout(() => {
                setIsFetchingToken(false);
            }, 750);
        });
    }, []);

    const login = (user, token) => {
        setContextUser(user);
        setToken(token);
    };

    const logout = () => {
        setIsFetchingToken(true);
        setContextUser(null);
        setToken('');

        setTimeout(() => {
            setIsFetchingToken(false);
        }, 750);
    };

    const updateToken = (token) => {
        setToken(token);
    };

    return (
        <AuthContext.Provider
            value={{ contextUser, token, isFetchingToken, login, logout, updateToken }}
        >
            {children}
        </AuthContext.Provider>
    );
}

const useAuthContext = () => useContext(AuthContext);

export { AuthProvider, AuthConsumer, useAuthContext };
export default AuthContext;
