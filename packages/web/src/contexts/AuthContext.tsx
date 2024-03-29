import React, { useContext, useState } from 'react';
import { AuthTokenResponse, User } from '../common/apiResponseTypes';
import { useFetchToken } from '../hooks';

type AuthProviderProps = {
    children?: React.ReactNode;
};

type AuthContextType = {
    contextUser: User | null;
    token: string; //jwt
    isFetchingToken: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
    updateToken: (token: string) => void;
    updateContextUser: (user: User) => void;
};

const AuthContext = React.createContext<AuthContextType>({
    contextUser: null,
    token: '',
    isFetchingToken: true,
    login: (user: User, token: string) => {},
    logout: () => {},
    updateToken: (token: string) => {},
    updateContextUser: (user: User) => {}
});

const AuthConsumer = AuthContext.Consumer;

function AuthProvider({ children }: AuthProviderProps) {
    const [contextUser, setContextUser] = useState<User | null>(null);
    const [token, setToken] = useState<string>('');

    const handleSuccess = (data: AuthTokenResponse) => {
        if (data?.access_token) {
            const { access_token: token } = data;
            setToken(token);
        }

        if (data?.user) {
            setContextUser(data.user);
        }
    };

    const { isLoading: isFetchingToken } = useFetchToken(12, handleSuccess);

    const login = (user: User, token: string) => {
        setContextUser(user);
        setToken(token);
    };

    const logout = () => {
        setContextUser(null);
        setToken('');
    };

    const updateToken = (token: string) => {
        setToken(token);
    };

    const updateContextUser = (user: User) => {
        setContextUser(user);
    };

    return (
        <AuthContext.Provider
            value={{
                contextUser,
                token,
                isFetchingToken,
                login,
                logout,
                updateToken,
                updateContextUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

const useAuthContext = () => useContext(AuthContext);

export { AuthProvider, AuthConsumer, useAuthContext };
export default AuthContext;
