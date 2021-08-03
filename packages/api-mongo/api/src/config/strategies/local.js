import PassportLocal from 'passport-local';
import User from '../../user/user-model';

const LocalStrategy = PassportLocal.Strategy;

const opts = {
    usernameField: 'email'
};

const verifyCb = (email, password, done) => {
    User.findOne({ email })
        .exec()
        .then(user => {
            if (!user) {
                return done(null, false, { message: 'Unable to find the user' });
            }

            if (!user.verifyPassword(password)) {
                return done(null, false, { message: 'Incorrect credentials provided' });
            }
            user.lastLoginAt = Date.now();
            user.save().then(user => done(null, user));
        })
        .catch(err => done(err));
};

export default new LocalStrategy(opts, verifyCb);
