import { Button } from '@mui/material';
import { useLogout } from '../../hooks';
import { commonStyles } from './styles';

function LogoutButton() {
    const { mutate: doLogout } = useLogout();

    return (
        <Button
            variant="outlined"
            disableRipple
            sx={{
                ...commonStyles,
                color: 'common.white',
                textTransform: 'capitalize',
                fontSize: '1rem',
                fontWeight: 400,
                letterSpacing: 'normal',
                '&.active, &:hover': {
                    backgroundColor: 'primary.dark'
                }
            }}
            onClick={() => doLogout()}
        >
            Log Out
        </Button>
    );
}

export default LogoutButton;
