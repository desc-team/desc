import PassportLocal, { IVerifyOptions } from 'passport-local';
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
    const user = await UserService.getUserByEmail(email);
    if (!user) {
        return done(null, false, { message: 'Unable to find user' });
    }

    if (!user.verifyPassword(password)) {
        return done(null, false, { message: 'Bad user credentials provided' });
    }
    user.lastLoginAt = new Date();
    return user.save().then(updatedUser => done(null, updatedUser));
};

export default new LocalStrategy(opts, verifyCb);
