import { BASE_URL } from '../services/util';

export function addNoteToItem({ itemId, noteBody, token }) {
    return fetch(`${BASE_URL}/api/items/${itemId}/notes`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(noteBody)
    }).then((response) => {
        if (response.ok) {
            return response.json();
        }
    });
}

export function updateItem({ itemId, itemData, token }) {
    return fetch(`${BASE_URL}/api/items/${itemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(itemData),
        credentials: 'include'
    }).then((response) => response.json());
}

export function getItems({ queryKey }) {
    const [, { token }] = queryKey;
    return fetch(`${BASE_URL}/api/items`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => response.json());
}

export function getItemsForUser({ queryKey }) {
    const [, { id, token }] = queryKey;
    return fetch(`${BASE_URL}/api/items?submittedBy=${id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => response.json());
}
