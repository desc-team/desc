import { AppBar, Stack, Toolbar } from '@mui/material';
import { useAuthContext } from '../../contexts/AuthContext';
import HomeLogo from './HomeLogo';
import LogoutButton from './LogoutButton';
import NavLink from './NavLink';

function NavBar(): JSX.Element {
    const { token } = useAuthContext();
    return (
        <AppBar position="static">
            <Toolbar disableGutters={true} sx={{ px: 12 }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ width: '100%' }}
                >
                    <HomeLogo />
                    <Stack direction="row">
                        {!token ? (
                            <>
                                <NavLink to="/login">Log In</NavLink>
                                <NavLink to="/register">Register</NavLink>
                            </>
                        ) : null}
                        {token ? <LogoutButton /> : null}
                    </Stack>
                </Stack>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
