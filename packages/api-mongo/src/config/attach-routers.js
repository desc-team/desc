import indexRouter from '../index/index-router';
import userRouter from '../user/user-router';
import authRouter from '../auth/auth-router';
import itemRouter from '../item/item-router';
import clientRequestRouter from '../client-request/client-request-router';

export default (app, passport) => {
    app.use('/', indexRouter());
    app.use('/api/users', userRouter());
    app.use('/api/auth', authRouter(passport));
    app.use('/api/items', itemRouter());
    app.use('/api/clientrequests', clientRequestRouter());

    app.use((err, req, res, next) => {
        console.error(err.message);
        res.json({
            success: false,
            message: 'Error: unable to complete request',
            payload: null
        });
    });
};
