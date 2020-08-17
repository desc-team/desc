import React, { useEffect, useState } from 'react';
import M from 'materialize-css';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import TextField from '../Common/TextField';
import { changePassword } from '../../services/users';

const css = {
    formContainer: {
        padding: '1.5rem 2rem',
        maxWidth: '670px',
        margin: '2.5rem auto 0'
    },
    cancelButton: {
        backgroundColor: 'white',
        color: 'teal',
        marginRight: '1rem'
    }
};

const ChangePasswordForm = () => {
    const { token } = useParams();
    const history = useHistory();

    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState(null);

    const [form, setForm] = useState({
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (form.confirmPassword.length > 0 && form.password !== form.confirmPassword) {
            setError('Passwords do NOT match');
        }
        if (form.confirmPassword.length > 0 && form.password === form.confirmPassword) {
            setError(null);
        }
        if (form.password.length > 0 && form.confirmPassword.length === 0) {
            setError(null);
        }
    }, [form]);

    const handleSubmit = e => {
        e.preventDefault();

        if (isFormValid()) {
            setIsFetching(true);
            changePassword(token, form.password)
                .then(data => {
                    if (data.success) {
                        setError(null);
                        M.toast({
                            html: 'Your password has been changed',
                            classes: 'teal',
                            displayLength: 3000,
                            completeCallback: () => {
                                history.push('/signin');
                            }
                        });
                    } else {
                        setError('Something went wrong; password not changed');
                    }
                    setForm({ password: '', confirmPassword: '' });
                    setIsFetching(false);
                })
                .catch(err => console.log(err));
        } else {
            setError('Password is not provided. Try again');
        }
    };

    const handleChange = e => {
        setForm({
            ...form,
            [e.target.id]: e.target.value
        });
    };

    const isFormValid = () => {
        return form.password.length > 0 && form.password === form.confirmPassword;
    };
    const handleCancel = () => {
        history.push('/');
    };

    return (
        <div className="card-panel" style={css.formContainer}>
            <h4 className="center-align teal-text text-darken-3">Change Password</h4>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col s12">
                        <TextField
                            label="Password"
                            icon="lock"
                            type="password"
                            name="password"
                            value={form.password}
                            handleChange={handleChange}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col s12">
                        <TextField
                            label="Confirm Password"
                            icon="lock"
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            error={error}
                            handleChange={handleChange}
                        />
                    </div>
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
                            {`${!isFetching ? 'Change Password' : 'Changing Password...'}`}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ChangePasswordForm;
