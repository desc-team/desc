import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const Home = () => {
    const authCtx = useAuthContext();
    return (
        <>
            {!authCtx.isFetchingToken && authCtx.contextUser ? (
                <h3 className="center-align teal-text">
                    Welcome, {`${authCtx.contextUser.name.first}`}
                </h3>
            ) : (
                <>
                    <div class="row">
                        <div class="col">
                            <h1 class="teal-text text-darken-2">Welcome to the DESC Portal!</h1>
                            <h4 class="blue-grey-text text-darken-1">
                                A place to manage requests for items to meet the needs of DESC's
                                clients
                            </h4>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col s12 l6 center">
                            <div class="card-panel grey lighten-3">
                                <p class="flow-text">
                                    No account? Head on over the sign up page and register for an
                                    account. It's super easy.
                                </p>
                                <Link to="/signup" class="waves-effect waves-light btn-large">
                                    <i class="material-icons left">person_add</i>Register
                                </Link>
                            </div>
                        </div>
                        <div class="col s12 l6 center">
                            <div class="card-panel grey lighten-3">
                                <p class="flow-text">
                                    Have an account? Login to make a new request or view the status
                                    of existing an one.
                                </p>
                                <Link to="/signin" class="waves-effect waves-light btn-large">
                                    <i class="material-icons left">exit_to_app</i>Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Home;
