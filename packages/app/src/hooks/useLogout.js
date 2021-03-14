import { useMutation } from 'react-query';
import { logout } from '../services/auth';

function useLogout(onSuccessCb) {
    return useMutation(logout, {
        onSuccess: onSuccessCb
    });
}

export default useLogout;
