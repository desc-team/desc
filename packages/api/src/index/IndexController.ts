import { Request, Response } from 'express';
import config from '../config/config';

class IndexController {
    homeRoute(_: Request, res: Response): Response {
        return res.json({
            success: true,
            message: 'api endpoint is not here',
            url: 'http://localhost:3001/api'
        });
    }

    apiRoute(_: Request, res: Response): Response {
        return res.json({
            success: true,
            name: config.name,
            version: config.version
        });
    }
}

export default new IndexController();
