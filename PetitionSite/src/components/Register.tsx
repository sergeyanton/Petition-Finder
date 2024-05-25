import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import {useEffect, useState} from "react";
import {Alert, AlertTitle, Checkbox, FormControlLabel} from "@mui/material";
import useUserStore from "../store/UserStore";



//Taken from MUI example library :: https://github.com/mui/material-ui/blob/v5.15.18/docs/data/material/getting-started/templates/sign-up/SignUp.tsx

const defaultTheme = createTheme();

export default function Register() {
    const [newUser, setNewUser] = useState<UserRegister>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });
    const [newUserId, setNewUserId] = React.useState<number>();
    const navigate = useNavigate();
    const [token, setToken] = React.useState<string>("");
    const [profileImage, setProfileImage] = React.useState<File | null>(null);
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loginPending, setLoginPending] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useUserStore((state) => state);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout> | null = null;

        if (errorFlag) {
            timeout = setTimeout(() => {
                setErrorFlag(false);
                setErrorMessage("");
            }, 3000);
        }

        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    }, [errorFlag]);


    useEffect(() => {
        if (newUser.firstName && newUser.lastName && newUser.email && newUser.password) {
            postUserRegister();
        }
    }, [newUser]);

    useEffect(() => {
        if (newUserId && token) {
            postUserImage();
        }
    }, [newUserId, token]);

    useEffect(() => {
        if (loginPending && token && newUserId) {
            login(newUserId, token);
            setLoginPending(false);
            navigate('/');
        }
    }, [loginPending, token, login, newUserId, navigate]);

    // const postUserRegister = async () => {
    //     try {
    //         const response = await axios.post('http://localhost:4941/api/v1/users/register', newUser);
    //         setNewUserId(response.data.userId);
    //         await postUserLogin();
    //         setLoginPending(true);
    //         setErrorFlag(false);
    //     } catch (error) {
    //         setErrorFlag(true);
    //         setErrorMessage(" Error saving user");
    //     }
    // };
//TODO: center the error text, add all error messages to error box.
    const postUserRegister = async () => {
        await axios.post('http://localhost:4941/api/v1/users/register', newUser)
            .then((response) => {
                setNewUserId(response.data.userId);
                postUserLogin();
                setLoginPending(true);
                setErrorFlag(false);
            })
            .catch((error) => {
                setErrorFlag(true);
                if(error.response.status === 403){
                    setErrorMessage("Email already exists");
                } else {
                    setErrorMessage("Invalid information");
                }
            });
    }

    const postUserLogin = async () => {
        try {
            const response = await axios.post('http://localhost:4941/api/v1/users/login', {
                email: newUser.email,
                password: newUser.password,
            });
            setToken(response.data.token);
        } catch (error) {
            setErrorFlag(true);
            setErrorMessage("Error logging in user");
        }
    };


    const postUserImage = async () => {
        if (profileImage && newUserId && token) {
            await axios.put(`http://localhost:4941/api/v1/users/${newUserId}/image`, profileImage, {
                headers: {
                    'Content-Type': profileImage.type,
                    'X-Authorization': token,
                },
            }).then(() => {setErrorFlag(false);
            }).catch((error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString() + " Error logging in user");
            });
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setNewUser({
            firstName: data.get('firstName') as string,
            lastName: data.get('lastName') as string,
            email: data.get('email') as string,
            password: data.get('password') as string,
        });
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setProfileImage(event.target.files[0]);
        }
    };

    const handlePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            {errorFlag && (
                <Alert severity="error" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <AlertTitle>Error</AlertTitle>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        {errorMessage}
                    </Box>
                </Alert>
            )}
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Box sx={{ position: 'relative' }}>
                        <Avatar
                            src={profileImage ? URL.createObjectURL(profileImage) : '/broken-image.jpg'}
                            sx={{ width: 70, height: 70 }}
                        />
                        <label htmlFor="image-upload">
                            <input
                                id="image-upload"
                                type="file"
                                style={{ display: 'none' }}
                                onChange={handleImageUpload}
                            />
                            <Button
                                variant="contained"
                                component="span"
                                sx={{
                                    height:25,
                                    width:25,
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0,
                                    borderRadius: '50%',
                                    minWidth: 0,
                                    padding: '6px',
                                }}>
                                <AddIcon />
                            </Button>
                        </label>
                    </Box>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    autoComplete="new-password"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={showPassword}
                                            onChange={handlePasswordVisibility}
                                            color="primary"
                                        />
                                    }
                                    label="Show Password"
                                />
                            </Grid>

                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2" onClick={() => navigate('/')}>
                                    Home
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2" onClick={() => navigate("/login")}>
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}