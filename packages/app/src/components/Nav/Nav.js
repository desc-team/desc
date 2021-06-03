import React, { useEffect } from 'react';
import M from 'materialize-css';
import { Link, NavLink } from 'react-router-dom';
import SignedOutLinks from './SignedOutLinks';
import SignedInLinks from './SignedInLinks';
import UserDropdown from './UserDropdown';
import { useAuthContext } from '../../context/AuthContext';
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

    useEffect(() => {
        const elems = document.querySelectorAll('.sidenav');
        M.Sidenav.init(elems);
    }, []);

    const handleLogout = () => {
        doLogout();
    };

    return (
        <>
            <nav className="nav-wrapper teal">
                <div className="container">
                    <a href="#!" data-target="mobile" className="sidenav-trigger">
                        <i className="material-icons">menu</i>
                    </a>
                    <Link to="/" className="brand-logo">
                        <span className="left" style={{ marginRight: '2rem' }}>
                            <img
                                className="hide-on-med-and-down"
                                src="https://www.desc.org/wp-content/themes/desc/img/logo-desc.png"
                                height="60"
                                width="60"
                                alt="DESC logo"
                            />
                            <span style={{ verticalAlign: 'top', marginLeft: '1rem' }}>
                                DESC Portal
                            </span>
                        </span>
                    </Link>
                    <ul className="right hide-on-med-and-down">
                        {!isAuthed && <SignedOutLinks />}
                        {isAuthed && (
                            <>
                                <SignedInLinks />
                                <UserDropdown
                                    user={authCtx.contextUser}
                                    targetName="profile"
                                    handleLogout={handleLogout}
                                />
                            </>
                        )}
                    </ul>
                </div>
            </nav>

            <ul className="sidenav" id="mobile">
                {!isAuthed && (
                    <>
                        <li>
                            <NavLink to="/signup" activeClassName="teal white-text">
                                Sign Up
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/signin" activeClassName="teal white-text">
                                Sign In
                            </NavLink>
                        </li>
                    </>
                )}
                {isAuthed && (
                    <>
                        <li>
                            <NavLink to="/create" activeClassName="teal white-text">
                                Create Request
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/inbox" activeClassName="teal white-text">
                                View Requests
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/profile" activeClassName="teal white-text">
                                Profile
                            </NavLink>
                        </li>
                        <li>
                            <Link to="/" onClick={handleLogout}>
                                Logout
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </>
    );
};

export default Nav;
