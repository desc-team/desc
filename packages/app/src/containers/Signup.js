import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import SignupForm from '../components/SignupForm/SignupForm';
import AuthContext from '../context/AuthContext';

const css = {
    container: {
        padding: '1.5rem 2rem',
        maxWidth: '670px',
        margin: '2.5rem auto'
    }
};

const SignupComplete = () => {
    return (
        <div style={css.container}>
            <h4 className="center-align teal-text text-darken-3">
                Thank you for registering for an account.
            </h4>
            <h5 className="center-align grey-text">
                We have sent an email to the account you provided. Please verify the address and
                then login.
            </h5>
        </div>
    );
};

const Signup = props => {
    const authCtx = useContext(AuthContext);
    const [isSignupComplete, setIsSignupComplete] = useState(false);

    if (authCtx.contextUser) {
        return <Redirect to="/" />;
    }

    return (
        <div>
            {!isSignupComplete ? (
                <SignupForm {...props} onRegister={() => setIsSignupComplete(true)} />
            ) : (
                <SignupComplete />
            )}
        </div>
    );
};

export default Signup;
