import { createUser } from '../user/user-controller';
import { generateToken } from '../auth/auth-utils';

export const userOllie = {
    name: {
        first: 'Oliver',
        last: 'Queen'
    },
    email: 'oliver@qc.com',
    program: 'employment',
    password: 'thegreenarrow',
    roles: ['admin', 'approver']
};

export const userBarry = {
    name: {
        first: 'Barry',
        last: 'Allen'
    },
    email: 'barry@starlabs.com',
    program: 'health',
    password: 'theflash',
    roles: ['requestor']
};

export const createUserAndGetToken = userData => {
    return createUser(userData).then(user => {
        return {
            user,
            token: generateToken(user)
        };
    });
};
