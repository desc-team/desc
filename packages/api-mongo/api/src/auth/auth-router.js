import express from 'express';
import config from '../config/config';
import * as AuthUtils from './auth-utils';

const AUTH_COOKIE_NAME = config.authCookieName;

export default passport => {
    let authRouter = express.Router();

    authRouter.post('/login', passport.authenticate('local'), (req, res) => {
        const user = req.user;
        const token = AuthUtils.generateToken(user);
        res.cookie(AUTH_COOKIE_NAME, token, { httpOnly: true, maxAge: 1000 * 60 * 60 /* 1hr */ });
        res.json({
            success: true,
            message: 'user authenticated',
            payload: {
                user: user.toClientJSON(),
                token
            }
        });
    });

    authRouter.get('/logout', (req, res) => {
        res.clearCookie(AUTH_COOKIE_NAME);
        res.json({
            success: true,
            message: 'user logged out',
            payload: null
        });
    });

    return authRouter;
};
