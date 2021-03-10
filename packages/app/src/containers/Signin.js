import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import SigninForm from '../components/SigninForm/SigninForm';
import AuthContext from '../context/AuthContext';

const Signin = (props) => {
    const authCtx = useContext(AuthContext);
    if (authCtx.contextUser) {
        return <Redirect to="/" />;
    }
    return <SigninForm {...props} />;
};

export default Signin;
