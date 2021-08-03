import express from 'express';
import config from '../config/config';
import * as UserController from './user-controller';
import * as AuthUtils from '../auth/auth-utils';

const AUTH_COOKIE_NAME = config.authCookieName;

const isAdmin = async (req, _, next) => {
    if (req.user) {
        const authUser = await UserController.getUser(req.user.id);
        if (authUser.isAdmin()) {
            next();
        } else {
            next(new Error('Error: Insufficient access level'));
        }
    } else {
        next(new Error('Error: protected route, user needs to be authenticated.'));
    }
};

const isOwnerOrAdmin = async (req, _, next) => {
    if (req.user) {
        const authUser = await UserController.getUser(req.user.id);
        if (authUser.isAdmin() || req.user.id === req.params.id) {
            next();
        } else {
            next(new Error('Error: Insufficient access level'));
        }
    } else {
        next(new Error('Error: protected route, user needs to be authenticated.'));
    }
};

export default () => {
    let userRouter = express.Router();
    userRouter
        .route('/')
        .get(isAdmin, (_, res) => {
            UserController.getUsers()
                .then(users => {
                    res.json({
                        success: true,
                        message: 'users fetched',
                        payload: { users }
                    });
                })
                .catch(err =>
                    res.json({
                        success: false,
                        message: err.message,
                        error: err
                    })
                );
        })
        .post((req, res) => {
            UserController.createUser(req.body)
                .then(user => {
                    req.user = user;

                    req.login(user, err => {
                        if (err) {
                            return next(err);
                        }

                        const token = AuthUtils.generateToken(user);
                        res.cookie(AUTH_COOKIE_NAME, token, {
                            httpOnly: true,
                            maxAge: 1000 * 60 * 60 // 1hr
                        });

                        return res.json({
                            success: true,
                            message: 'user created',
                            payload: {
                                user: user.toClientJSON(),
                                token
                            }
                        });
                    });
                })
                .catch(err =>
                    res.json({
                        success: false,
                        message: err.message,
                        error: err
                    })
                );
        });

    userRouter
        .route('/:id([0-9a-zA-Z]{24})')
        .get(isOwnerOrAdmin, (req, res) => {
            UserController.getUser(req.params.id)
                .then(user =>
                    res.json({
                        success: true,
                        message: 'user fetched',
                        payload: { user }
                    })
                )
                .catch(err =>
                    res.json({
                        success: false,
                        message: err.message,
                        error: err
                    })
                );
        })
        .put(isOwnerOrAdmin, (req, res) => {
            UserController.updateUser(req.params.id, req.body)
                .then(user =>
                    res.json({
                        success: true,
                        message: 'user updated',
                        payload: { user }
                    })
                )
                .catch(err =>
                    res.json({
                        success: false,
                        message: err.message,
                        error: err
                    })
                );
        })
        .delete(isOwnerOrAdmin, (req, res) => {
            UserController.deleteUser(req.params.id)
                .then(user =>
                    res.json({
                        success: true,
                        message: 'user deleted',
                        payload: { user }
                    })
                )
                .catch(err =>
                    res.json({
                        success: false,
                        message: err.message,
                        error: err
                    })
                );
        });

    userRouter.route('/me').get(async (req, res) => {
        let payload = null;
        if (req.user) {
            const user = await UserController.getUser(req.user.id);
            if (user) {
                const token = AuthUtils.generateToken(user);
                payload = { user: user.toClientJSON(), token };
            }
        } else {
            payload = {
                user: null,
                token: ''
            };
        }
        return res.json({
            success: true,
            message: 'auth user endpoint',
            payload
        });
    });

    // below endpoint is for test purposes only
    userRouter.route('/testonly').post((req, res) => {
        if (process.env.NODE_ENV !== 'testing') {
            return res.json({
                success: false,
                message: 'creation of test user only availabe in test mode',
                payload: {
                    user: null
                }
            });
        }
        UserController.createUser(req.body)
            .then(user => {
                return res.json({
                    success: true,
                    message: 'test user created',
                    payload: {
                        user: user.toClientJSON()
                    }
                });
            })
            .catch(err =>
                res.json({
                    success: false,
                    message: err.message,
                    error: err
                })
            );
    });

    return userRouter;
};
