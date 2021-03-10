import { BASE_URL } from './util';

export const signup = (userData) => {
    return fetch(`${BASE_URL}/api/users`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    }).then((res) => {
        if (res.ok && res.status === 201) {
            return res.json();
        }
    });
};

export const confirmEmail = (token) => {
    return fetch(`${BASE_URL}/api/users/confirmemail/${token}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
    }).then((res) => {
        if (res.ok && res.status === 200) {
            return res.json();
        }
    });
};

export const forgotPassword = (email) => {
    return fetch(`${BASE_URL}/api/users/forgotpassword`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    }).then((res) => {
        if (res.ok && res.status === 200) {
            return res.json();
        }
    });
};

export const changePassword = (token, newPassword) => {
    return fetch(`${BASE_URL}/api/users/changepassword/${token}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword })
    }).then((res) => {
        if (res.ok && res.status === 200) {
            return res.json();
        }
    });
};
