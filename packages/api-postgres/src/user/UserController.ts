import { Request, Response } from 'express';
import UserService from './UserService';

class UserController {
    static createUser(req: Request, res: Response): Promise<Response> {
        const { firstName, lastName, email, password } = req.body;

        return UserService.createUser(firstName, lastName, email, password).then(user => {
            return res.json({
                success: true,
                message: 'user created',
                payload: { user }
            });
        });
    }
}

export default UserController;
