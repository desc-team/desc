import { useQuery } from 'react-query';
import { useAuthContext } from '../context/AuthContext';
import { getItems } from '../services/items';

function useItems(id) {
    const { token } = useAuthContext();
    return useQuery(['items', { token }], getItems);
}

export default useItems;
