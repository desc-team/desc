import bcrypt from 'bcryptjs';
import config from '../config/config';

const NUM_ROUNDS_TESTING = 1;
const NUM_ROUNDS_PROD = 12;

let numRounds = config.env === 'testing' ? NUM_ROUNDS_TESTING : NUM_ROUNDS_PROD;

export function hashPassword(next) {
    let user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(numRounds, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            user.passwordLastUpdatedAt = Date.now();
            next(null, user);
        });
    });
}

export function checkForErrors(err, user, next) {
    if (err.name === 'MongoError' && err.code === 11000) {
        next(new Error('There was a duplicate key error'));
    } else {
        next(err);
    }
}
