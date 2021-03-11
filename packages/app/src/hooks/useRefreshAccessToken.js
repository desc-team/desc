import { useQuery } from 'react-query';
import { refreshToken } from '../services/auth';

function useRefreshAccessToken(interval, onSuccessCb) {
    return useQuery('refreshAccessToken', refreshToken, {
        refetchInterval: 1000 * 60 * interval,
        onSuccess: onSuccessCb
    });
}

export default useRefreshAccessToken;
