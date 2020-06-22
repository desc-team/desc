import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { confirmEmail } from '../services/users';

const css = {
    container: {
        padding: '1.5rem 2rem',
        maxWidth: '670px',
        margin: '2.5rem auto'
    },

    secondary_text: {
        fontSize: '1.25rem'
    }
};

const ConfirmEmail = ({ match }) => {
    const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);
    const [isConfirming, setIsConfirming] = useState(true);

    useEffect(() => {
        confirmEmail(match.params.token).then(response => {
            if (response && response.success) {
                setIsEmailConfirmed(true);
            }
            setIsConfirming(false);
        });
    }, [match.params.token]);

    return (
        <div style={css.container}>
            {isEmailConfirmed && !isConfirming && (
                <React.Fragment>
                    <h4 className="center-align teal-text text-darken-3">
                        Thank you for confirming your email
                    </h4>
                    <p className="grey-text text-darken-2" style={css.secondary_text}>
                        We appreciate you taking the time to confirm your email. It will greatly
                        assist us in the future should we need to send you any important
                        information.
                    </p>
                    <p className="grey-text text-darken-2" style={css.secondary_text}>
                        Feel free to <Link to="/login">login</Link> to access your account.
                    </p>
                </React.Fragment>
            )}

            {!isEmailConfirmed && !isConfirming && (
                <h5 className="center-align red-text text-darken-2">
                    Oops, looks like we were unable to confirm your email
                </h5>
            )}
        </div>
    );
};

export default ConfirmEmail;
