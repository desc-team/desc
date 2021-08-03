import express from 'express';
import * as ClientRequestController from './client-request-controller';

const handleError = response => {
    return err =>
        response.json({
            success: false,
            message: err.message,
            error: err
        });
};

const isAuth = async (req, _, next) => {
    if (req.user) {
        next();
    } else {
        next(new Error('Error: protected route, user needs to be authenticated.'));
    }
};

export default () => {
    let clientRequestRouter = express.Router();

    clientRequestRouter
        .route('/')
        .post(isAuth, (req, res) => {
            ClientRequestController.createClientRequest(req.body)
                .then(clientRequest =>
                    res.json({
                        success: true,
                        message: 'client request created',
                        payload: {
                            clientRequest
                        }
                    })
                )
                .catch(handleError(res));
        })
        .get(isAuth, (_, res) => {
            ClientRequestController.getClientRequests()
                .then(clientRequests =>
                    res.json({
                        success: true,
                        message: 'client requests fetched',
                        payload: {
                            clientRequests
                        }
                    })
                )
                .catch(handleError(res));
        });

    clientRequestRouter.route('/:id([0-9a-zA-Z]{24})').get(isAuth, (req, res) => {
        ClientRequestController.getClientRequest(req.params.id)
            .then(clientRequest =>
                res.json({
                    success: true,
                    message: 'client request fetched',
                    payload: { clientRequest }
                })
            )
            .catch(handleError(res));
    });

    return clientRequestRouter;
};
