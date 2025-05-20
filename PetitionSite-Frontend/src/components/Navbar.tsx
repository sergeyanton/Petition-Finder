import useUserStore from "../store/UserStore";
import { AppBar, Box, Button, Toolbar, Dialog, DialogContent, DialogActions, Typography} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const Navbar = () => {
    const { isLoggedIn, logout } = useUserStore((state) => state);
    const navigate = useNavigate();
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

    const handleLogin = () => {
        navigate('/login');
    };

    const handleRegister = () => {
        navigate('/register');
    };

    const handleProfile = () => {
        navigate('/profile');
    }

    const handleLogout = () => {
        setLogoutDialogOpen(true);
    };

    const handleLogoutConfirm = () => {
        logout();
        navigate('/');
        setLogoutDialogOpen(false);
    };
    const handleCreatePetition = () => {
        navigate('/createPetition');
    }

    const handleLogoutCancel = () => {
        setLogoutDialogOpen(false);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Box sx={{ display: 'flex', alignItems: 'center'}}>
                    <Button variant="outlined" color="inherit" onClick={() => navigate('/')}>
                        Home
                    </Button>
                    {isLoggedIn && (
                        <Button variant="outlined" color="inherit" onClick={handleCreatePetition} sx={{ ml: 2 }}>
                            Create Petition
                        </Button>
                    )}
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                {isLoggedIn ? (
                    <>
                        <Button variant="outlined" color="inherit" onClick={handleProfile} sx={{ mr: 2 }}>
                            Profile
                        </Button>
                        <Button variant="outlined" color="inherit" onClick={handleLogout} sx={{ mr: 2 }}>
                            Logout
                        </Button>
                    </>
                ) : (
                    <>
                        <Button variant="outlined" color="inherit" onClick={handleLogin} sx={{ mr: 2 }}>
                            Login
                        </Button>
                        <Button variant="outlined" color="inherit" onClick={handleRegister} sx={{ mr: 2 }}>
                            Register
                        </Button>
                    </>
                )}
            </Toolbar>
            <Dialog
                open={logoutDialogOpen}
                onClose={handleLogoutCancel}
            >
                <DialogContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'black',
                    }}
                >
                    <Typography id="logout-dialog-title" variant="h6" component="h2">
                        Are you sure you want to logout?
                    </Typography>
                </DialogContent>
                <DialogActions
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleLogoutConfirm}
                        startIcon={<CheckIcon />}
                    >
                        Yes
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleLogoutCancel}
                        startIcon={<CloseIcon />}
                    >
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </AppBar>
    );
};
export default Navbar;