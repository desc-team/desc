import { useMutation } from 'react-query';
import { makeClientRequest } from '../services/clientRequests';

function useClientRequest(onSuccessCb) {
    return useMutation(makeClientRequest, {
        onSuccess: onSuccessCb
    });
}

export default useClientRequest;
