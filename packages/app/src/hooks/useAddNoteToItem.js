import { useMutation } from 'react-query';
import { useAuthContext } from '../context/AuthContext';
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
    const { token } = useAuthContext();
    const mutation = useMutation(addNoteToItem, {
        onSuccess: onSuccessCb
    });

    const addNote = (payload) => {
        mutation.mutate({ ...payload, token });
    };

    return {
        ...mutation,
        addNote
    };
}

export default useAddNoteToItem;
