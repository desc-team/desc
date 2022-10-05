import { Link, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function HomeLogo() {
    return (
        <Link to="/" component={RouterLink} variant="h5" underline="none" color="inherit">
            <Stack direction="row" spacing={2} alignItems="center">
                <img
                    className=""
                    src="https://www.desc.org/wp-content/themes/desc/img/logo-desc.png"
                    height="60"
                    width="60"
                    alt="DESC logo"
                />
                <span>DESC Portal</span>
            </Stack>
        </Link>
    );
}

export default HomeLogo;
