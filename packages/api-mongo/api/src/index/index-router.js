import express from 'express';
import * as IndexController from './index-controller';

export default () => {
    let indexRouter = express.Router();
    indexRouter.get('/api', IndexController.getRootAPIRoute);
    indexRouter.get('/', IndexController.renderIndexPage);
    return indexRouter;
};
