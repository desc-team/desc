import { useMutation } from 'react-query';
import { useAuthContext } from '../context/AuthContext';
import { addNoteToItem } from '../services/items';

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
