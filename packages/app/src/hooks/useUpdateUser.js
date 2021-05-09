import { useMutation } from 'react-query';
import { useAuthContext } from '../context/AuthContext';
import { updateUserData } from '../services/users';

function useUpdateUser(onSuccessCb) {
    const { token } = useAuthContext();
    const mutation = useMutation(updateUserData, {
        onSuccess: onSuccessCb
    });

    const updateUser = (payload) => {
        mutation.mutate({ ...payload, token });
    };

    return {
        ...mutation,
        updateUser
    };
}

export default useUpdateUser;
