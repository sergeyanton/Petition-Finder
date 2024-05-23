import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Card,
    CardContent,
    Typography,
    Avatar,
    Box,
    Button,
    TextField,
    Grid,
} from '@mui/material';
import useUserStore from '../store/UserStore';

const Profile = () => {
    const { isLoggedIn, token, userId } = useUserStore((state) => state);
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:4941/api/v1/users/${userId}`, {
                    headers: {
                        'X-Authorization': token!,
                    },
                });
                setUser(response.data);
                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
                setEmail(response.data.email);
                setProfileImagePreview(
                    `http://localhost:4941/api/v1/users/${userId}/image`
                );
            } catch (error) {
                setErrorFlag(true);
                setErrorMessage('Error fetching user profile');
            }
        };

        fetchUserProfile();
    }, [userId, token]);

    const handleEditProfile = () => {
        setEditMode(true);
    };

    const handleSaveProfile = async () => {
        // try {
        //     const updatedUser: UserPatch = {
        //         firstName,
        //         lastName,
        //         email,
        //     };
        //
        //     await axios.patch(`http://localhost:4941/api/v1/users/${userId}`, updatedUser, {
        //         headers: {
        //             'X-Authorization': token!,
        //         },
        //     });
        //
        //     if (profileImage) {
        //         await axios.put(
        //             `http://localhost:4941/api/v1/users/${userId}/image`,
        //             profileImage,
        //             {
        //                 headers: {
        //                     'Content-Type': profileImage.type,
        //                     'X-Authorization': token!,
        //                 },
        //             }
        //         );
        //     }
        //
        //     setEditMode(false);
        //     setErrorFlag(false);
        // } catch (error) {
        //     setErrorFlag(true);
        //     setErrorMessage('Error updating profile');
        // }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setProfileImage(event.target.files[0]);
            setProfileImagePreview(URL.createObjectURL(event.target.files[0]));
        }
    };

    return (
        <Card>
            {errorFlag && (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                    }}
                >
                    <Typography variant="h6" color="error">
                        {errorMessage}
                    </Typography>
                </Box>
            )}
            {user && (
                <CardContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                    }}
                >
                    <Avatar
                        src={profileImagePreview || 'https://via.placeholder.com/100'}
                        alt={`${user.firstName} ${user.lastName}`}
                        sx={{ width: 100, height: 100, marginBottom: '16px' }}
                    />
                    {editMode ? (
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="First Name"
                                    variant="outlined"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Last Name"
                                    variant="outlined"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <label htmlFor="profile-image">
                                    <input
                                        id="profile-image"
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={handleImageUpload}
                                    />
                                    <Button variant="contained">Upload Profile Image</Button>
                                </label>
                            </Grid>
                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        marginTop: '16px',
                                    }}
                                >
                                    <Button variant="contained" onClick={handleSaveProfile}>
                                        Save
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    ) : (
                        <>
                            <Typography variant="h5">
                                {user.firstName} {user.lastName}
                            </Typography>
                            <Typography variant="body1">{user.email}</Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    marginTop: '16px',
                                }}
                            >
                                <Button variant="contained" onClick={handleEditProfile}>
                                    Edit Profile
                                </Button>
                            </Box>
                        </>
                    )}
                </CardContent>
            )}
        </Card>
    );
};

export default Profile;