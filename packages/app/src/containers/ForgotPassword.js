import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import ForgotPasswordForm from '../components/ForgotPasswordForm/ForgotPasswordForm';

const ForgotPassword = () => {
    const authCtx = useContext(AuthContext);

    if (authCtx.contextUser) {
        return <Redirect to="/" />;
    }

    return <ForgotPasswordForm />;
};

export default ForgotPassword;
