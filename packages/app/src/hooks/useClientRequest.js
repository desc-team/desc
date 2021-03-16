import { useMutation } from 'react-query';
import { useAuthContext } from '../context/AuthContext';
import { makeClientRequest } from '../services/clientRequests';

function useClientRequest(onSuccessCb) {
    const { token } = useAuthContext();
    const mutation = useMutation(makeClientRequest, {
        onSuccess: onSuccessCb
    });

    const makeRequest = (payload) => {
        mutation.mutate({ ...payload, token });
    };

    return {
        ...mutation,
        makeRequest
    };
}

export default useClientRequest;
