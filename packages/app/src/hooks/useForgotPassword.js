import { useMutation } from 'react-query';
import { forgotPassword } from '../services/users';

function useForgotPassword(onSuccessCb, onErrorCb) {
    return useMutation(forgotPassword, {
        onSuccess: onSuccessCb,
        onError: onErrorCb
    });
}

export default useForgotPassword;
