import { useQuery } from 'react-query';
import { BASE_URL } from '../services/util';
import { useAuthContext } from '../context/AuthContext';

function getItemsForUser({ queryKey }) {
    const [, { id, token }] = queryKey;
    return fetch(`${BASE_URL}/api/items?submittedBy=${id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => response.json());
}

function useItemsByUserId(id) {
    const { token } = useAuthContext();
    return useQuery(['items', { id, token }], getItemsForUser);
}

export default useItemsByUserId;
