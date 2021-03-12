import { useMutation } from 'react-query';
import { signup } from '../services/users';

function useSignup(onSuccessCb) {
    return useMutation(signup, {
        onSuccess: onSuccessCb
    });
}

export default useSignup;
