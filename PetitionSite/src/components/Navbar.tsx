import { AppBar, Toolbar, Button, Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('token');

    const handleLogin = () => {
        navigate('/login');
    };

    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <AppBar position="static" sx={{ height: '60px' }}>
            <Container maxWidth="lg">
                <Toolbar sx={{ minHeight: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button color="inherit" onClick={() => navigate('/')} sx={{ marginRight: '16px' }}>
                            Home
                        </Button>
                        <Button color="inherit" onClick={handleLogin} sx={{ marginRight: '16px' }}>
                            Login
                        </Button>
                        <Button color="inherit" onClick={handleRegister}>
                            Register
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;