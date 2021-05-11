import React, { useEffect, useState } from 'react';
import M from 'materialize-css';
// import { useAuthContext } from '../context/AuthContext';
import TextField from '../Common/TextField';
import avatar from '../UserProfileDetails/default_avatar.png';

const avatarBgColor = '#e0f1f2';

const css = {
    cancelButton: {
        backgroundColor: 'white',
        color: 'teal',
        marginRight: '1rem'
    }
};
const EditProfile = ({ onUpdate, user }) => {
    const [form, setValues] = useState({
        firstName: user.name.first,
        lastName: user.name.last,
        email: user.email,
        program: user.program
    });

    useEffect(() => {
        M.updateTextFields();
        const elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);
    }, []);

    const handleChange = (e) => {
        setValues({
            ...form,
            [e.target.id]: e.target.value
        });
    };

    function handleUpdate(evt) {
        console.log({ form });
    }

    function handleCancel() {
        onUpdate();
    }

    return (
        <div>
            <div className="row">
                <div className="col s12 m6 l6">
                    <img
                        className="circle responsive-img"
                        style={{
                            backgroundColor: avatarBgColor,
                            display: 'block',
                            margin: '0 auto'
                        }}
                        width="200"
                        height="200"
                        src={avatar}
                        alt="default user avatar"
                    />
                </div>
                <div className="col s12 m6 l6">
                    <h4 className="grey-text text-darken-2">Edit Profile</h4>
                    <div className="row">
                        <div className="col s6">
                            <TextField
                                label="First Name"
                                icon="account_circle"
                                type="text"
                                name="firstName"
                                value={form.firstName}
                                handleChange={handleChange}
                            />
                        </div>
                        <div className="col s6">
                            <TextField
                                label="Last Name"
                                icon="account_circle"
                                type="text"
                                name="lastName"
                                value={form.lastName}
                                handleChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <i className="small material-icons prefix">domain</i>
                            <select
                                defaultValue={form.program}
                                id="program"
                                onChange={handleChange}
                            >
                                <option value="housing first">Housing First</option>
                                <option value="integrated services">Integrated Services</option>
                                <option value="survival services">Survival Services</option>
                                <option value="health services">Health Services</option>
                                <option value="employment services">Employment Services</option>
                                <option value="research_innovation">
                                    Research &amp; Innovation
                                </option>
                            </select>
                            <label htmlFor="program">Program</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s12">
                            <TextField
                                label="Your Email"
                                icon="email"
                                type="text"
                                name="email"
                                value={form.email}
                                handleChange={handleChange}
                                validate
                            />
                        </div>
                    </div>
                    <div className="right">
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
                            onClick={handleUpdate}
                        >
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
