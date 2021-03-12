import { useMutation } from 'react-query';
import { login } from '../services/auth';

function useLogin(onSuccessCb) {
    return useMutation(login, {
        onSuccess: onSuccessCb
    });
}

export default useLogin;
