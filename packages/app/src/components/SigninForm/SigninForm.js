import React, { useState, useContext } from 'react';
import 'materialize-css';
import AuthContext from '../../context/AuthContext';

const SigninForm = ({ history }) => {
    const authCtx = useContext(AuthContext);

    const [form, setValues] = useState({
        email: '',
        password: ''
    });

    const handleChange = e => {
        setValues({
            ...form,
            [e.target.id]: e.target.value
        });
    };

    const isFormValid = () => {
        return form.email.length > 0 && form.password.length > 0;
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (isFormValid()) {
            authCtx.login(
                { name: 'Oliver Queen', email: 'oliver@qc.com' },
                'somerandomtokenstringhere'
            );
            history.push('/');
        }
    };

    const handleCancel = () => {
        history.push('/');
    };

    return (
        <div
            className="card-panel"
            style={{ padding: '20px 30px', maxWidth: '560px', margin: '0 auto' }}
        >
            <h4 className="center-align teal-text text-darken-3">Sign In to Account</h4>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="input-field col s12">
                        <i className="small material-icons prefix">email</i>
                        <input
                            className="validate"
                            type="email"
                            id="email"
                            value={form.memail}
                            onChange={handleChange}
                        />
                        <label htmlFor="email">Your Email</label>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s12">
                        <i className="small material-icons prefix">lock</i>
                        <input
                            type="password"
                            id="password"
                            value={form.password}
                            onChange={handleChange}
                        />
                        <label htmlFor="password">Password</label>
                    </div>
                </div>
                <div className="row">
                    <div className="col offset-s1 offset-l7">
                        <div className="row">
                            <button
                                className="btn"
                                type="button"
                                onClick={handleCancel}
                                style={{
                                    backgroundColor: 'white',
                                    color: 'teal',
                                    marginRight: '20px'
                                }}
                            >
                                Cancel
                            </button>
                            <button className="btn" type="submit">
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SigninForm;
