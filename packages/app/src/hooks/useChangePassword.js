import { useMutation } from 'react-query';
import { changePassword } from '../services/users';

function useChangePassword(onSuccessCb) {
    return useMutation(changePassword, {
        onSuccess: onSuccessCb
    });
}

export default useChangePassword;
