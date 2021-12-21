import { useMutation } from 'react-query';
import { useAuthContext } from '../context/AuthContext';
import { updateItem as updateItemService } from '../services/items';

function useUpdateItem(onSuccessCb) {
    const { token } = useAuthContext();
    const mutation = useMutation(updateItemService, {
        onSuccess: onSuccessCb
    });

    const updateItem = (payload) => {
        mutation.mutate({ ...payload, token });
    };

    return {
        ...mutation,
        updateItem
    };
}

export default useUpdateItem;
