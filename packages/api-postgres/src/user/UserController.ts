import { Request, Response } from 'express';
import User from '../entity/User';
import UserService from './UserService';
import AuthUtils from '../auth/AuthUtils';
import Mailer from '../mailer/Mailer';
import { UpdatableUserFields } from '../common/types';

class UserController {
    static createUser(req: Request, res: Response): Promise<Response> {
        // TODO: add better input validation to ensure the updated data has the required shape and/or
        // only includes the accepted properties
        const { firstName, lastName, email, password, program } = req.body;

        return UserService.createUser({ firstName, lastName, email, password, program })
            .then(async (user) => {
                const baseUrl = (req.get('origin') as string) || '';
                await Mailer.sendVerificationEmail(baseUrl, user);

                return res.status(201).json({
                    success: true,
                    message: 'user created',
                    payload: {
                        user: user.toClientJSON()
                    }
                });
            })
            .catch((err) => {
                return res.json({
                    success: false,
                    message: 'error creating user',
                    payload: {
                        error: err.message,
                        user: null
                    }
                });
            });
    }

    static getAllUsers(_: Request, res: Response): Promise<Response> {
        return UserService.getAllUsers()
            .then((users) => {
                return res.json({
                    success: true,
                    message: 'all users fetched',
                    payload: { users }
                });
            })
            .catch((err) => {
                return res.json({
                    success: false,
                    message: 'error fetching users',
                    payload: {
                        error: err.message,
                        users: null
                    }
                });
            });
    }

    static getUser(req: Request, res: Response): Promise<Response> {
        const id = req.params.id;
        return UserService.getUserById(id)
            .then((user) => {
                if (user) {
                    return res.json({
                        success: true,
                        message: 'user fetched',
                        payload: { user }
                    });
                } else {
                    return res.json({
                        success: false,
                        message: 'user not found',
                        payload: { user: null }
                    });
                }
            })
            .catch((err) => {
                return res.json({
                    success: false,
                    message: 'error fetching user',
                    payload: {
                        error: err.message,
                        user: null
                    }
                });
            });
    }

    static updateUser(req: Request, res: Response): Promise<Response> {
        const id = req.params.id;

        // TODO: add better input validation to ensure the updated data has the required shape and/or
        // only includes the accepted properties
        const data = req.body as UpdatableUserFields;

        return UserService.updateUser(id, data)
            .then((updatedUser) => {
                if (updatedUser) {
                    return res.json({
                        success: true,
                        message: 'user updated',
                        payload: { user: updatedUser.toClientJSON() }
                    });
                } else {
                    return res.json({
                        success: false,
                        message: 'user not found',
                        payload: { user: null }
                    });
                }
            })
            .catch((err) => {
                return res.json({
                    success: false,
                    message: 'error updating user',
                    payload: {
                        error: err.message,
                        user: null
                    }
                });
            });
    }

    static deleteUser(req: Request, res: Response): Promise<Response> {
        const id = req.params.id;
        return UserService.deleteUser(id)
            .then((deletedUser) => {
                if (deletedUser) {
                    return res.json({
                        success: true,
                        message: 'user deleted',
                        payload: { user: deletedUser }
                    });
                } else {
                    return res.json({
                        success: false,
                        message: 'user not found',
                        payload: { user: null }
                    });
                }
            })
            .catch((err) => {
                return res.json({
                    success: false,
                    message: 'error deleting user',
                    payload: {
                        error: err.message,
                        user: null
                    }
                });
            });
    }

    static deactivateUser(req: Request, res: Response): Promise<Response> {
        const id = req.params.id;
        return UserService.setIsActive(id, false)
            .then((deactivatedUser) => {
                if (deactivatedUser) {
                    return res.json({
                        success: true,
                        message: 'user deactivated',
                        payload: { user: deactivatedUser }
                    });
                } else {
                    return res.json({
                        success: false,
                        message: 'user not found',
                        payload: { user: null }
                    });
                }
            })
            .catch((err) => {
                return res.json({
                    success: false,
                    message: 'error deactivating user',
                    payload: {
                        error: err.message,
                        user: null
                    }
                });
            });
    }

    static activateUser(req: Request, res: Response): Promise<Response> {
        const id = req.params.id;
        return UserService.setIsActive(id, true)
            .then((activatedUser) => {
                if (activatedUser) {
                    return res.json({
                        success: true,
                        message: 'user activated',
                        payload: { user: activatedUser }
                    });
                } else {
                    return res.json({
                        success: false,
                        message: 'user not found',
                        payload: { user: null }
                    });
                }
            })
            .catch((err) => {
                return res.json({
                    success: false,
                    message: 'error activating user',
                    payload: {
                        error: err.message,
                        user: null
                    }
                });
            });
    }

    static confirmEmail(req: Request, res: Response): Promise<Response> {
        const emailToken = req.params.token;
        return UserService.confirmEmail(emailToken)
            .then((user) => {
                if (user) {
                    return res.json({
                        success: true,
                        message: 'email confirmed',
                        payload: {
                            user: user.toClientJSON()
                        }
                    });
                } else {
                    return res.json({
                        success: false,
                        message: 'email token not found',
                        payload: {
                            user: null
                        }
                    });
                }
            })
            .catch((err) => {
                return res.json({
                    success: false,
                    message: 'error confirming email',
                    payload: {
                        error: err.message,
                        user: null
                    }
                });
            });
    }

    static forgotPassword(req: Request, res: Response): Promise<Response> {
        const { email } = req.body;
        return UserService.generatePasswordResetToken(email).then(async (user) => {
            if (user) {
                const baseUrl = (req.get('origin') as string) || '';
                await Mailer.sendPasswordResetEmail(baseUrl, user);

                return res.json({
                    success: true,
                    message: 'password reset instructions sent to user email',
                    payload: {
                        email: user.email
                    }
                });
            }

            return res.json({
                success: false,
                message: 'user not found',
                payload: {
                    email: null
                }
            });
        });
    }

    static changePassword(req: Request, res: Response): Promise<Response> {
        const resetToken = req.params.token;
        const { newPassword } = req.body;
        return UserService.changePassword(resetToken, newPassword)
            .then((user) => {
                if (user) {
                    return res.json({
                        success: true,
                        message: 'password changed',
                        payload: {
                            user: user.toClientJSON()
                        }
                    });
                } else {
                    return res.json({
                        success: false,
                        message: 'password not changed',
                        payload: {
                            user: null
                        }
                    });
                }
            })
            .catch(() => {
                return res.json({
                    success: false,
                    message: 'error with reset token',
                    payload: {
                        user: null
                    }
                });
            });
    }

    static async me(req: Request, res: Response): Promise<Response> {
        const baseResponse = {
            success: true,
            message: 'authenticated user'
        };
        let json = null;
        let payload = null;
        const reqUser = req.user as User;
        if (reqUser) {
            const user: User = (await UserService.getUserById(reqUser.id)) as User;
            if (user) {
                payload = {
                    user: user.toClientJSON(),
                    accessToken: AuthUtils.createAccessToken(user)
                };
                json = {
                    ...baseResponse,
                    payload
                };
            }
        } else {
            payload = {
                user: null
            };
            json = {
                ...baseResponse,
                message: 'no authenticated user',
                payload
            };
        }

        return res.json(json);
    }
}

export default UserController;
