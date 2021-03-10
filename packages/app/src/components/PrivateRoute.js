import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const authCtx = useAuthContext();
    return (
        <Route
            {...rest}
            render={(props) =>
                authCtx.token ? <Component {...props} /> : <Redirect to="/signin" />
            }
        />
    );
};

export default PrivateRoute;
