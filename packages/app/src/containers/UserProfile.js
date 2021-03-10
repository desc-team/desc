import React from 'react';
import UserProfileDetails from '../components/UserProfileDetails';
import { useAuthContext } from '../context/AuthContext';

const UserProfile = () => {
    const authCtx = useAuthContext();

    return (
        <React.Fragment>
            <div style={{ marginTop: '5rem' }}>
                <UserProfileDetails user={authCtx.contextUser} />
            </div>
        </React.Fragment>
    );
};

export default UserProfile;
