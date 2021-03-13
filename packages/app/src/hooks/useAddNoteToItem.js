import { useMutation } from 'react-query';
import { BASE_URL } from '../services/util';

function addNoteToItem({ itemId, noteBody, token }) {
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

function useAddNoteToItem(onSuccessCb) {
    return useMutation(addNoteToItem, {
        onSuccess: onSuccessCb
    });
}

export default useAddNoteToItem;
