import React from 'react';
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
                <h3 className="center-align teal-text">Home Page</h3>
            )}
        </>
    );
};

export default Home;
