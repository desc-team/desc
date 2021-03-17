import { useQuery } from 'react-query';
import { useAuthContext } from '../context/AuthContext';
import { getItemsForUser } from '../services/items';

function useItemsByUserId(id) {
    const { token } = useAuthContext();
    return useQuery(['items', { id, token }], getItemsForUser);
}

export default useItemsByUserId;
