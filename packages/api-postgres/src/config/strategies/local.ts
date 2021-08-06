import PassportLocal, { IVerifyOptions } from 'passport-local';
import { getEntityManager } from '../../common/entityUtils';
import UserService from '../../user/UserService';

const LocalStrategy = PassportLocal.Strategy;

const opts = {
    usernameField: 'email'
};

const verifyCb: PassportLocal.VerifyFunction = async (
    email: string,
    password: string,
    done: (error: any, user?: any, options?: IVerifyOptions) => void
): Promise<void> => {
    const em = getEntityManager();
    const user = await UserService.getUserByEmail(email);
    if (!user) {
        return done(null, false, { message: 'Unable to find user' });
    }

    if (!user.verifyPassword(password)) {
        return done(null, false, { message: 'Bad user credentials provided' });
    }

    if (!user.isActive) {
        return done(null, false, { message: 'User is no longer active' });
    }

    user.lastLoginAt = new Date();
    return em.save(user).then((updatedUser) => done(null, updatedUser));
};

export default new LocalStrategy(opts, verifyCb);
