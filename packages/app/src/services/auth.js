import jwt from 'jsonwebtoken';
import { BASE_URL } from './util';

export const login = creds => {
    return fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds)
    }).then(response => {
        if (response.status === 200) {
            return response.json();
        }
        if (response.status === 401) {
            return {
                success: false,
                message: 'unauthorized'
            };
        }
    });
};

export const logout = () => {
    return fetch(`${BASE_URL}/api/auth/logout`, {
        method: 'GET',
        credentials: 'include'
    }).then(response => response.json());
};

export const fetchSessionUser = () => {
    return fetch(`${BASE_URL}/api/users/me`, {
        method: 'GET',
        credentials: 'include'
    }).then(response => response.json());
};

export function getRefreshToken(currentToken) {
    const tokenExpires = jwt.decode(currentToken).exp;
    const now = Date.now().valueOf() / 1000;
    if (now > tokenExpires) {
        return fetch('http://localhost:3001/api/auth/refreshtoken', {
            credentials: 'include'
        }).then(res => res.json());
    }
    return Promise.resolve('token is still valid');
}
