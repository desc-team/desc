import { Link } from '@mui/material';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { commonStyles } from './styles';

interface NavLinkProps {
    children: React.ReactNode;
    to: string;
}

function NavLink({ children, to }: NavLinkProps): JSX.Element {
    return (
        <Link
            to={to}
            component={RouterNavLink}
            color="inherit"
            underline="none"
            sx={{
                ...commonStyles,
                px: 2,
                '&.active, &:hover': {
                    backgroundColor: 'primary.dark'
                }
            }}
        >
            {children}
        </Link>
    );
}

export default NavLink;
