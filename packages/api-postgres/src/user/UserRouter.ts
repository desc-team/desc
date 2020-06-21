import express, { Request, Response, NextFunction } from 'express';
import UserController from './UserController';
import UserService from './UserService';
import { isAdmin, checkForRefreshToken } from '../common/routerMiddleware';

async function isAdminOrSelf(req: Request, _: Response, next: NextFunction): Promise<void> {
    if (req.user) {
        const id: string = (req.user as any).id;

        const authUser = await UserService.getUserById(id);
        if (authUser?.isAdmin() || authUser?.isOwner(req.params.id)) {
            next();
        } else {
            next(new Error('Error: Insufficient access level'));
        }
    } else {
        next(new Error('Error: protected route, user needs to be authenticated.'));
    }
}

class UserRouter {
    private static router = express.Router();
    static getRouter(): express.Router {
        UserRouter.defineRoutes();
        return UserRouter.router;
    }

    private static defineRoutes(): void {
        UserRouter.router.route('/me').get(checkForRefreshToken, UserController.me);

        UserRouter.router
            .route('/')
            .post(UserController.createUser)
            .get(isAdmin, UserController.getAllUsers);

        UserRouter.router
            .route('/:id')
            .get(isAdminOrSelf, UserController.getUser)
            .patch(isAdminOrSelf, UserController.updateUser)
            .delete(isAdminOrSelf, UserController.deleteUser);

        UserRouter.router.route('/confirmemail/:token').patch(UserController.confirmEmail);
    }
}

export default UserRouter;
