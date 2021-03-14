import React from 'react';
import { Link } from 'react-router-dom';
import SignedOutLinks from './SignedOutLinks';
import SignedInLinks from './SignedInLinks';
import UserDropdown from './UserDropdown';
import { useAuthContext } from '../../context/AuthContext';
import { logout } from '../../services/auth';
import './Nav.css';
import useLogout from '../../hooks/useLogout';

const Nav = () => {
    const authCtx = useAuthContext();
    const isAuthed = authCtx.contextUser && authCtx.token;

    const { mutate: doLogout } = useLogout((response) => {
        if (response.success) {
            authCtx.logout();
        }
    });

    const handleLogout = () => {
        doLogout();
    };

    return (
        <nav className="nav-wrapper teal">
            <div className="container">
                <Link to="/">
                    <span className="brand-logo desc-logo left">
                        <img
                            src="https://www.desc.org/wp-content/themes/desc/img/logo-desc.png"
                            height="60"
                            width="60"
                            alt="DESC logo"
                        />
                        <span className="desc-title">DESC Portal</span>
                    </span>
                </Link>
                <ul className="right ">
                    {!isAuthed && <SignedOutLinks />}
                    {isAuthed && (
                        <>
                            <SignedInLinks />
                            <UserDropdown user={authCtx.contextUser} handleLogout={handleLogout} />
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Nav;
