import {
    TextField,
    Button,
    Grid,
    Autocomplete,
    Typography,
    Alert,
    AlertTitle,
    CardMedia,
    Card,
    CardContent,
    Box, Dialog, DialogContent, DialogActions,
} from "@mui/material";
import useUserStore from "../store/UserStore.ts";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as React from "react";
import Navbar from "./Navbar.tsx";
import CSS from "csstype";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from '@mui/icons-material/Delete';

const CreatePetition = ({
                            isEditing = false,
                            petitionDataPassed,
                            onClose,
                        }: {
    isEditing?: boolean;
    petitionDataPassed?: Petition;
    onClose: () => void;
}) => {
    const { isLoggedIn, token, userId } = useUserStore((state) => state);
    const navigate = useNavigate();
    const [title, setTitle] = useState(
        isEditing && petitionDataPassed ? petitionDataPassed.title : ""
    );
    const [description, setDescription] = useState(
        isEditing && petitionDataPassed ? petitionDataPassed.description : ""
    );
    const [categoryId, setCategoryId] = useState<number | null>(
        isEditing && petitionDataPassed ? petitionDataPassed.categoryId : null
    );
    const [petitionImage, setPetitionImage] = useState<File | null>(null);
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [categories, setCategories] = useState<
        { categoryId: number; name: string }[]
    >([]);
    const pData: Petition = petitionDataPassed!;
    const [supportTiers, setSupportTiers] = useState<SupportTierPost[]>(
        isEditing && pData
            ? pData.supportTiers.map((tier) => ({
                title: tier.title,
                description: tier.description,
                cost: tier.cost,
            }))
            : [{ title: "", description: "", cost: 0 }]
    );
    const [petitionImagePreview, setPetitionImagePreview] = useState<
        string | null
    >(
        isEditing && pData
            ? `http://localhost:4941/api/v1/petitions/${pData.petitionId}/image`
            : null
    );
    const initialSupportTiers = useRef<SupportTierPost[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);



    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn, navigate]);

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

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:4941/api/v1/petitions/categories"
                );
                setCategories(response.data);
            } catch (error) {
                setErrorFlag(true);
                setErrorMessage("Error fetching categories");
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        initialSupportTiers.current = supportTiers;
    }, [supportTiers]);

    const handleTierChange = (
        index: number,
        field: "title" | "description" | "cost",
        value: string | number
    ) => {
        const updatedTiers = [...supportTiers];
        if (field === "title" || field === "description") {
            if (typeof value === "string") {
                updatedTiers[index][field] = value;
            } else {
                setErrorMessage(`Value for ${field} must be a string`);
            }
        } else if (field === "cost") {
            if (typeof value === "number") {
                updatedTiers[index][field] = value;
            } else {
                setErrorMessage(`Value for cost must be a number`);
            }
        }
        setSupportTiers(updatedTiers);
    };

    const handleAddTier = () => {
        if (supportTiers.length < 3) {
            setSupportTiers([...supportTiers, { title: "", description: "", cost: 0 }]);
        } else {
            setErrorFlag(true);
            setErrorMessage("You can only have up to 3 support tiers");
        }
    };

    const handleRemoveTier = async (index: number) => {
        const supportTierId = petitionDataPassed?.supportTiers[index]?.supportTierId;

        if (supportTierId) {
            try {
                const response = await axios.get(
                    `http://localhost:4941/api/v1/petitions/${petitionDataPassed.petitionId}/supporters`,
                    {
                        headers: {
                            "X-Authorization": token!,
                        },
                    }
                );

                const hasSupporters = response.data.some(
                    (supporter: Supporter) => supporter.supportTierId === supportTierId
                );

                if (hasSupporters) {
                    setErrorFlag(true);
                    setErrorMessage("Support tier cannot be deleted as it has supporters");
                    return;
                }

                // Delete the support tier
                await axios.delete(
                    `http://localhost:4941/api/v1/petitions/${petitionDataPassed.petitionId}/supportTiers/${supportTierId}`,
                    {
                        headers: {
                            "X-Authorization": token!,
                        },
                    }
                );

                const updatedTiers = [...supportTiers];
                updatedTiers.splice(index, 1);
                setSupportTiers(updatedTiers);
            } catch (error) {
                setErrorFlag(true);
                setErrorMessage("Error deleting support tier");
            }
        } else {
            const updatedTiers = [...supportTiers];
            updatedTiers.splice(index, 1);
            setSupportTiers(updatedTiers);
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setPetitionImage(event.target.files[0]);
            setPetitionImagePreview(URL.createObjectURL(event.target.files[0]));
        }
    };

    const handleSubmit = () => {
        // Validate the form fields
        if (title.trim() === "") {
            setErrorFlag(true);
            setErrorMessage("Title is required");
            return;
        }

        if (description.trim() === "") {
            setErrorFlag(true);
            setErrorMessage("Description is required");
            return;
        }

        if (categoryId === null) {
            setErrorFlag(true);
            setErrorMessage("Category is required");
            return;
        }

        if (supportTiers.length < 1 || supportTiers.length > 3) {
            setErrorFlag(true);
            setErrorMessage("You must have between 1 and 3 support tiers");
            return;
        }

        for (const tier of supportTiers) {
            if (tier.title.trim() === "") {
                setErrorFlag(true);
                setErrorMessage("Support tier title is required");
                return;
            }

            if (tier.description.trim() === "") {
                setErrorFlag(true);
                setErrorMessage("Support tier description is required");
                return;
            }

            if (tier.cost < 0) {
                setErrorFlag(true);
                setErrorMessage("Support tier cost must be a positive number");
                return;
            }
        }

        if (!isEditing) {
            const petitionData: PetitionPost = {
                title,
                description,
                categoryId,
                supportTiers,
            };

            axios
                .post("http://localhost:4941/api/v1/petitions", petitionData, {
                    headers: {
                        "X-Authorization": token!,
                    },
                })
                .then((response) => {
                    const petitionId = response.data.petitionId;
                    axios
                        .put(
                            `http://localhost:4941/api/v1/petitions/${petitionId}/image`,
                            petitionImage,
                            {
                                headers: {
                                    "Content-Type": petitionImage?.type,
                                    "X-Authorization": token!,
                                },
                            }
                        )
                        .then(() => {
                            setErrorFlag(false);
                            navigate(`/petition/${petitionId}`);
                        })
                        .catch((error) => {
                            setErrorFlag(true);
                            setErrorMessage(
                                error.toString() + " Error uploading petition image"
                            );
                        });
                })
                .catch((error) => {
                    setErrorFlag(true);
                    if (error.response.status === 403) {
                        setErrorMessage("Petition title already exists");
                    } else {
                        setErrorMessage("Error creating petition");
                    }
                });
        } else {
            // Update the support tiers
            const promises = supportTiers.map((tier, index) => {
                if (petitionDataPassed?.supportTiers[index]) {
                    // Update an existing support tier
                    const currentTier = petitionDataPassed.supportTiers[index];
                    if (
                        tier.title !== currentTier.title ||
                        tier.description !== currentTier.description ||
                        tier.cost !== currentTier.cost
                    ) {
                        // Check if the support tier has been changed
                        return axios.patch(
                            `http://localhost:4941/api/v1/petitions/${petitionDataPassed.petitionId}/supportTiers/${currentTier.supportTierId}`,
                            tier,
                            {
                                headers: {
                                    "X-Authorization": token!,
                                },
                            }
                        );
                    }
                } else {
                    // Create a new support tier
                    return axios.put(
                        `http://localhost:4941/api/v1/petitions/${petitionDataPassed?.petitionId}/supportTiers`,
                        tier,
                        {
                            headers: {
                                "X-Authorization": token!,
                            },
                        }
                    );
                }
                return Promise.resolve(); // Return a resolved promise if no update is needed
            });

            Promise.all(promises)
                .then(() => {
                    setErrorFlag(false);
                    onClose();
                    navigate(`/petition/${petitionDataPassed?.petitionId}`)
                })
                .catch(() => {
                    setErrorFlag(true);
                    setErrorMessage("Error updating support tiers");
                });
        }
    };

    const handleDeletePetition = () => {
        // Check if the user is the owner of the petition
        if (petitionDataPassed?.ownerId !== userId) {
            setErrorFlag(true);
            setErrorMessage("Only the owner of a petition can delete it.");
            return;
        }

        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            // Check if the petition has any supporters
            const response = await axios.get(
                `http://localhost:4941/api/v1/petitions/${petitionDataPassed?.petitionId}/supporters`,
                {
                    headers: {
                        "X-Authorization": token!,
                    },
                }
            );

            if (response.data.length > 0) {
                setErrorFlag(true);
                setErrorMessage("A petition cannot be deleted once it has supporters.");
                setDeleteDialogOpen(false);
                return;
            }

            // Delete the petition
            await axios.delete(
                `http://localhost:4941/api/v1/petitions/${petitionDataPassed?.petitionId}`,
                {
                    headers: {
                        "X-Authorization": token!,
                    },
                }
            );

            // Close the CreatePetition component and navigate to the home page
            navigate("/");
        } catch (error) {
            setErrorFlag(true);
            setErrorMessage("Error deleting the petition.");
            setDeleteDialogOpen(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
    };
    const petitionCardStyles: CSS.Properties = {
        width: "1000px",
        margin: "10px",
        padding: "0px",
        boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    };

    return (
        <>
        <Card>
            {errorFlag && (
                <Alert
                    severity="error"
                    sx={{
                        width: "40%",
                        marginBottom: 2,
                        alignItems: "center",
                    }}
                >
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage}
                </Alert>
            )}
            <Card sx={petitionCardStyles}>
                <Navbar />
            </Card>
            <Card sx={petitionCardStyles}>
                <CardContent>
                    <Typography variant="h4" sx={{ marginBottom: 2, marginTop: 2 }}>
                        {isEditing ? "Edit Petition" : "Create Petition"}
                    </Typography>
                    <CardMedia
                        component="img"
                        height="400"
                        image={petitionImagePreview || "https://via.placeholder.com/400x200"}
                        alt="Petition Image"
                    />
                    <Card>
                        <CardContent>
                            <Grid item xs={12} sx={{ margin: "20px" }}>
                                <label htmlFor="petition-image">
                                    <input
                                        id="petition-image"
                                        type="file"
                                        style={{ display: "none" }}
                                        onChange={handleImageUpload}
                                    />
                                    <Button variant="contained">Upload Petition Image</Button>
                                </label>
                            </Grid>
                            <Grid item xs={12} sx={{ width: "80%", justifyContent: "space-between" }}>
                                <TextField
                                    label="Title"
                                    variant="outlined"
                                    fullWidth
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ marginTop: "10px", marginBottom: "10px" }}>
                                <TextField
                                    label="Description"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ marginTop: "10px", marginBottom: "15px" }}>
                                <Autocomplete
                                    options={categories}
                                    getOptionLabel={(option) => option.name}
                                    value={categories.find((c) => c.categoryId === categoryId) || null}
                                    onChange={(_, value) => setCategoryId(value?.categoryId || null)}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Category" variant="outlined" fullWidth />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h5" sx={{ marginBottom: "10px" }}>
                                    Support Tiers
                                </Typography>
                                {supportTiers.map((tier, index) => (
                                    <Grid container spacing={2} key={index}>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                label={`Tier ${index + 1} Title`}
                                                variant="outlined"
                                                fullWidth
                                                value={tier.title}
                                                onChange={(e) => handleTierChange(index, "title", e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                label={`Tier ${index + 1} Description`}
                                                variant="outlined"
                                                fullWidth
                                                value={tier.description}
                                                onChange={(e) =>
                                                    handleTierChange(index, "description", e.target.value)
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                label={`Tier ${index + 1} Cost`}
                                                variant="outlined"
                                                fullWidth
                                                type="number"
                                                value={tier.cost}
                                                onChange={(e) =>
                                                    handleTierChange(index, "cost", parseFloat(e.target.value))
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={1} sx={{marginBottom: '20px'}}>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleRemoveTier(index)}>
                                                Remove
                                            </Button>
                                        </Grid>
                                    </Grid>
                                ))}
                                <Button variant="contained" onClick={handleAddTier}>
                                    Add Tier
                                </Button>
                            </Grid>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginTop: "20px",
                                }}>
                                <Button variant="contained" onClick={handleSubmit} startIcon={<CheckIcon />}>
                                    {isEditing ? "Save" : "Create"}
                                </Button>
                                {isEditing && (
                                    <Box sx={{ display: "flex", gap: "10px" }}>
                                        <Button
                                            variant="outlined"
                                            onClick={onClose}
                                            startIcon={<CloseIcon />}>
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={handleDeletePetition}
                                            startIcon={<DeleteIcon />}>
                                            Delete
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        </Card>
            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
                <DialogContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "black",
                    }}>
                    <Typography id="delete-dialog-title" variant="h6" component="h2">
                        Are you sure you want to delete this petition?
                    </Typography>
                </DialogContent>
                <DialogActions
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                    }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleDeleteConfirm}
                        startIcon={<CheckIcon />}>
                        Yes
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleDeleteCancel}
                        startIcon={<CloseIcon />}>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default CreatePetition;