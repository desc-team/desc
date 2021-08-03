import User from '../user/user-model';
import LocalStrategy from './strategies/local';

export default passport => {
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id)
            .exec()
            .then(user => {
                if (user) {
                    return done(null, user);
                }
            })
            .catch(err => done(err));
    });

    passport.use('local', LocalStrategy);
};
