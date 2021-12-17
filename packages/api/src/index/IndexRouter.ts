import express from 'express';
import indexController from './IndexController';

class IndexRouter {
    private static router = express.Router();

    static getRouter(): express.Router {
        IndexRouter.defineRoutes();
        return IndexRouter.router;
    }

    private static defineRoutes(): void {
        IndexRouter.router.get('/', indexController.homeRoute);
        IndexRouter.router.get('/api', indexController.apiRoute);
    }
}

export default IndexRouter;
