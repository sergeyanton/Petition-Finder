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
    Grid, Alert, AlertTitle,
} from '@mui/material';
import useUserStore from '../store/UserStore';
import CSS from "csstype";
import Navbar from "./Navbar.tsx";
import PetitionsListObject from "./PetitionsListObject.tsx";
import EditIcon from '@mui/icons-material/Edit';

const Profile = () => {
    const { isLoggedIn, token, userId } = useUserStore((state) => state);
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [isEditProfile, setIsEditProfile] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isCurrentPasswordFocused, setIsCurrentPasswordFocused] = useState(false);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [myPetitions, setMyPetitions] = useState<Petition[]>([]);
    const [deleteProfileFlag, setDeleteProfileFlag] = useState(false);
    const [supportedPetitions, setSupportedPetitions] = useState<Petition[]>([]);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        const getMyPetitions = async () => {
            axios.get('http://localhost:4941/api/v1/petitions', {
                params: {
                    ownerId: userId?.toString(),
                },
            }).then((response) => {
                setErrorFlag(false);
                setMyPetitions(response.data.petitions);
            }).catch(() => {
                setErrorFlag(true);
                setErrorMessage('Error fetching user petitions');
            });
        }

        getMyPetitions();
    }, [token, userId]);

    useEffect(() => {
        const getUserProfile = async () => {
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

        getUserProfile();
    }, [userId, token]);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout> | null = null;
        if (errorFlag) {
            window.scrollTo({ top: 0, behavior: "smooth" });
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

    const handleEditProfile = () => {
        setIsEditProfile(true);
    };

    useEffect(() => {
        const getSupportedPetitions = async () => {
            axios.get('http://localhost:4941/api/v1/petitions', {
                params: {
                    supporterId: userId?.toString(),
                },
            }).then((response) => {
                setErrorFlag(false);
                setSupportedPetitions(response.data.petitions);
            }).catch(() => {
                setErrorFlag(true);
                setErrorMessage('Error fetching supported petitions');
            });
        }

        getSupportedPetitions();
    }, [token, userId]);

    const handleSaveProfile = async () => {
        const initialUser: InitialUser = {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
        };

        const updatedUser: UserPatch = {
            firstName: firstName !== initialUser.firstName ? firstName : undefined,
            lastName: lastName !== initialUser.lastName ? lastName : undefined,
            email: email !== initialUser.email ? email : undefined,
            password: newPassword === '' ? undefined : newPassword,
            currentPassword: currentPassword ? currentPassword : undefined
        };

        try {

            if (Object.keys(updatedUser).length === 0) {
                setIsEditProfile(false);
                setErrorFlag(false);
                return;
            }

            const patchResponse = await axios.patch(
                `http://localhost:4941/api/v1/users/${userId}`, updatedUser,
                {
                    headers: {
                        'X-Authorization': token!,
                    },
                }
            );

            if (patchResponse.status === 200) {
                if (profileImage) {
                    const putResponse = await axios.put(
                        `http://localhost:4941/api/v1/users/${userId}/image`,
                        profileImage,
                        {
                            headers: {
                                'Content-Type': profileImage.type,
                                'X-Authorization': token!,
                            },
                        }
                    );

                    if (putResponse.status === 200 || putResponse.status === 201) {
                        setIsEditProfile(false);
                        setErrorFlag(false);
                    } else {
                        setErrorFlag(true);
                        setErrorMessage('Error updating profile image');
                    }
                } else if (deleteProfileFlag) {
                    const deleteResponse = await axios.delete(
                        `http://localhost:4941/api/v1/users/${userId}/image`,
                        {
                            headers: {
                                'X-Authorization': token!,
                            },
                        }
                    );

                    if (deleteResponse.status === 200) {
                        window.location.reload();
                        setIsEditProfile(false);
                        setErrorFlag(false);
                    } else {
                        setErrorFlag(true);
                        setErrorMessage('Error deleting profile image');
                    }
                } else {
                    window.location.reload();
                    setIsEditProfile(false);
                    setErrorFlag(false);
                }
            } else if (patchResponse.status === 400) {
                setErrorFlag(true);
                setErrorMessage('Invalid information');
            } else if (patchResponse.status === 401) {
                setErrorFlag(true);
                setErrorMessage('Invalid current password');
            } else if (patchResponse.status === 403) {
                setErrorFlag(true);
                setErrorMessage('Email already in use');
            } else {
                setErrorFlag(true);
                setErrorMessage('Error updating profile');
            }
        } catch (error) {
            setErrorFlag(true);
            setErrorMessage('Error updating profile');
        }
    };


    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setProfileImage(event.target.files[0]);
            setProfileImagePreview(URL.createObjectURL(event.target.files[0]));
        }
    };

    const handleDeleteProfileImage = () => {
        setDeleteProfileFlag(true)
        setProfileImage(null);
        setProfileImagePreview('/broken-image.jpg');
    };

    const handleCurrentPasswordFocus = () => {
        setIsCurrentPasswordFocused(true);
    };

    const handleCurrentPasswordBlur = () => {
        setIsCurrentPasswordFocused(false);
    };

    const handleClose = () => {
        setIsEditProfile(false);
        setFirstName(user?.firstName || '');
        setLastName(user?.lastName || '');
        setEmail(user?.email || '');
        setCurrentPassword('');
        setNewPassword('');
        setProfileImage(null);
        setProfileImagePreview(user ? `http://localhost:4941/api/v1/users/${userId}/image` : '/broken-image.jpg');
        setDeleteProfileFlag(false);
    };

    const petitionCardStyles: CSS.Properties = {
        width: "1000px",
        margin: "10px",
        padding: "0px",
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    };

    return (
        <Card>
            {errorFlag && (
                <Alert severity="error" sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    width: '30%',
                    margin: '0 auto'
                }}>
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage}
                </Alert>
            )}
            {user && (
                <>
                    <Card sx={petitionCardStyles}>
                        <Navbar />
                    </Card>
                <Card sx={petitionCardStyles}>
                <CardContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                    }}>
                    <Box sx={{ position: 'relative' }}>
                        <Avatar
                            src={profileImagePreview || '/broken-image.jpg'}
                            alt={`${user.firstName} ${user.lastName}`}
                            sx={{ width: 100, height: 100, marginBottom: '16px' }}
                        />
                        {isEditProfile && (
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
                                        height: 30,
                                        width: 30,
                                        position: 'absolute',
                                        bottom: 10,
                                        right: 5,
                                        borderRadius: '50%',
                                        minWidth: 0,
                                        padding: '6px',
                                    }}
                                >
                                    <EditIcon />
                                </Button>
                            </label>
                        )}
                    </Box>
                    {isEditProfile ? (
                        <Grid container spacing={2} sx={{ marginTop: '50px' }}>
                            <Grid item xs={12}>
                                <TextField
                                    label="First Name"
                                    variant="outlined"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
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
                                <TextField
                                    label="Current Password"
                                    variant="outlined"
                                    value={currentPassword}
                                    type = "password"
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    onFocus={handleCurrentPasswordFocus}
                                    onBlur={handleCurrentPasswordBlur}
                                />
                            </Grid>
                            {(isCurrentPasswordFocused || currentPassword) && (
                                <Grid item xs={12}>
                                    <TextField
                                        label="New Password"
                                        variant="outlined"
                                        value={newPassword}
                                        type = "password"
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </Grid>
                            )}
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
                                    <Button
                                        variant="contained"
                                        sx={{ marginLeft: '10px' }}
                                        onClick={handleClose}>
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{ marginLeft: '10px' }}
                                        onClick={handleDeleteProfileImage}>
                                        Delete Profile Image
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
                                }}>
                                <Button variant="contained" onClick={handleEditProfile}>
                                    Edit Profile
                                </Button>
                            </Box>
                        </>
                    )}
                </CardContent>
                </Card>
                </>
            )}
            <Card sx={petitionCardStyles}>
                <Typography variant="h4" component="div" sx={{ marginTop: '20px', minHeight: '100px' }}>
                    My Petitions:
                </Typography>
                {myPetitions.length > 0 ? (
                    <Grid container spacing={2} sx={{ alignItems: 'center', justifyContent: 'center' }} >
                        {myPetitions?.map((petition) => (
                            <Grid sx={{ marginBottom: '20px' }}>
                                <PetitionsListObject
                                    petition={petition}
                                    currentPetitionId={ petition.petitionId}
                                    categoryId={ petition.categoryId}
                                    ownerId={ petition.ownerId}
                                />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box sx={{ justifyContent: 'center', alignItems: 'center', minHeight: '50px', marginBottom: '30px' }}>
                        <Typography variant="h5">
                            You don't own any petitions
                        </Typography>
                    </Box>
                )}
            </Card>
            <Card sx={petitionCardStyles}>
                <Typography variant="h4" component="div" sx={{ marginTop: '20px', minHeight: '100px' }}>
                    Petitions I Support:
                </Typography>
                {supportedPetitions.length > 0 ? (
                    <Grid container spacing={2} sx={{ alignItems: 'center', justifyContent: 'center' }} >
                        {supportedPetitions?.map((petition) => (
                            <Grid sx={{ marginBottom: '20px' }}>
                                <PetitionsListObject
                                    petition={petition}
                                    currentPetitionId={petition.petitionId}
                                    categoryId={petition.categoryId}
                                    ownerId={petition.ownerId}
                                />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box sx={{ justifyContent: 'center', alignItems: 'center', minHeight: '50px', marginBottom: '30px' }}>
                        <Typography variant="h5">
                            You don't support any petitions
                        </Typography>
                    </Box>
                )}
            </Card>
        </Card>
    );
};

export default Profile;