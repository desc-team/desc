import { useMutation } from 'react-query';
import { confirmEmail } from '../services/users';

function useConfirmEmail() {
    return useMutation(confirmEmail);
}

export default useConfirmEmail;
