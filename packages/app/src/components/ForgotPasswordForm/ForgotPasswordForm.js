import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import M from 'materialize-css';
import TextField from '../Common/TextField';
import { forgotPassword } from '../../services/users';

const css = {
    formContainer: {
        padding: '1.5rem 2rem',
        maxWidth: '670px',
        margin: '2.5rem auto 0'
    },

    errorText: {
        padding: '0 4rem',
        fontSize: '1rem'
    },

    cancelButton: {
        backgroundColor: 'white',
        color: 'teal',
        marginRight: '1rem'
    },

    message: {
        marginTop: '2rem',
        fontSize: '1.25rem'
    }
};

const ForgotPasswordForm = () => {
    const history = useHistory();
    const textFieldRef = useRef();

    const [isRequestSent, setIsRequestSent] = useState(false);
    const [email, setEmail] = useState('');
    const [formValue, setFormValue] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        setFormValue((v) => '');
        setTimeout(() => {
            M.updateTextFields();
            if (textFieldRef.current) {
                textFieldRef.current.classList.remove('valid');
            }
        }, 250);
    }, [email]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formValue.length > 0) {
            forgotPassword(formValue).then((data) => {
                if (data.success) {
                    setEmail(data.payload.email);
                    setIsRequestSent(true);
                } else {
                    setError('Something went wrong. Please try again.');
                }
            });
        }
    };

    const handleCancel = () => {
        history.push('/');
    };

    const handleChange = (e) => {
        setFormValue(e.target.value);
    };

    return (
        <div className="card-panel" style={css.formContainer}>
            <h4 className="center-align teal-text text-darken-3">Reset Password</h4>
            <p className="grey-text text-darken-1" style={{ fontSize: '1.25rem' }}>
                Enter the email address associated with your account and we'll send you a link to
                reset your password.
            </p>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col s12">
                        <TextField
                            ref={textFieldRef}
                            label="Your Email"
                            icon="email"
                            type="text"
                            name="email"
                            value={formValue}
                            handleChange={handleChange}
                            validate
                        />
                    </div>
                </div>
                <div className="row">
                    {error.length > 0 && (
                        <p className="red-text" style={css.errorText} data-testid="error-message">
                            {error}
                        </p>
                    )}
                </div>
                <div className="row">
                    <div className="col right">
                        <button
                            className="btn"
                            type="button"
                            onClick={handleCancel}
                            style={css.cancelButton}
                        >
                            Cancel
                        </button>
                        <button
                            className="waves-effect waves-light btn"
                            type="submit"
                            data-testid="submit-btn"
                        >
                            Reset Password
                        </button>
                    </div>
                </div>
            </form>
            {isRequestSent && (
                <p
                    className="teal-text text-darken-3"
                    style={css.message}
                    data-testid="success-message"
                >
                    Thank you. An email has been sent to <em>{`${email}`}</em> with instructions to
                    reset your password.
                </p>
            )}
        </div>
    );
};

export default ForgotPasswordForm;
