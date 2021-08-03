import express from 'express';
import * as ItemController from './item-controller';
import { getUser } from '../user/user-controller';

const handleError = response => {
    return err =>
        response.json({
            success: false,
            message: err.message,
            error: err
        });
};

const processQueryParams = (req, _, next) => {
    Object.keys(req.query).forEach(queryParam => {
        if (queryParam === 'itemCategory') {
            req.query.itemCategory = req.query.itemCategory
                .toLowerCase()
                .replace(/^\w/, c => c.toUpperCase());
        }
    });
    next();
};

const isAuth = async (req, _, next) => {
    if (req.user) {
        next();
    } else {
        next(new Error('Error: protected route, user needs to be authenticated.'));
    }
};

const isOwnerOrAdmin = async (req, _, next) => {
    if (req.user) {
        const authUser = await getUser(req.user.id);
        const item = await ItemController.getItem(req.params.id);
        if (authUser.isAdmin() || req.user.id === item.submittedBy._id.toString()) {
            next();
        } else {
            next(new Error('Error: Insufficient access level'));
        }
    } else {
        next(new Error('Error: protected route, user needs to be authenticated.'));
    }
};

export default () => {
    let itemRouter = express.Router();

    itemRouter
        .route('/')
        .get(isAuth, processQueryParams, (req, res) => {
            ItemController.getItems(req.query)
                .then(items =>
                    res.json({
                        success: true,
                        message: 'items fetched',
                        payload: {
                            items
                        }
                    })
                )
                .catch(handleError(res));
        })
        .post(isAuth, (req, res) => {
            ItemController.createItem(req.body)
                .then(item =>
                    res.json({
                        success: true,
                        message: 'item created',
                        payload: {
                            item
                        }
                    })
                )
                .catch(handleError(res));
        });

    itemRouter
        .route('/:id([0-9a-zA-Z]{24})')
        .get(isAuth, (req, res) => {
            ItemController.getItem(req.params.id)
                .then(item =>
                    res.json({
                        success: true,
                        message: 'item fetched',
                        payload: { item }
                    })
                )
                .catch(handleError(res));
        })
        .put(isOwnerOrAdmin, (req, res) => {
            ItemController.updateItem(req.params.id, req.body)
                .then(item =>
                    res.json({
                        success: true,
                        message: 'item updated',
                        payload: { item }
                    })
                )
                .catch(handleError(res));
        })
        .delete(isOwnerOrAdmin, (req, res) => {
            ItemController.deleteItem(req.params.id)
                .then(item =>
                    res.json({
                        success: true,
                        message: 'item deleted',
                        payload: { item }
                    })
                )
                .catch(handleError(res));
        });

    itemRouter.route('/:id([0-9a-zA-Z]{24})/notes').post(isAuth, (req, res) => {
        ItemController.addNote(req.params.id, req.body)
            .then(item =>
                res.json({
                    success: true,
                    message: 'note added to item',
                    payload: { item }
                })
            )
            .catch(handleError(res));
    });

    return itemRouter;
};
