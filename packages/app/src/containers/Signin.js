import React from 'react';
import { Redirect } from 'react-router-dom';
import SigninForm from '../components/SigninForm/SigninForm';
import { useAuthContext } from '../context/AuthContext';

const Signin = (props) => {
    const authCtx = useAuthContext();
    if (authCtx.contextUser) {
        return <Redirect to="/" />;
    }
    return <SigninForm {...props} />;
};

export default Signin;
