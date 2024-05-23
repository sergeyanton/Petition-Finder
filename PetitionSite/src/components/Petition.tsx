import {useState, useEffect} from 'react';
import {useParams, useLocation} from 'react-router-dom';
import axios from 'axios';
import CSS from 'csstype';
import {Alert, AlertTitle, Avatar, Box, Button, Card, CardContent, CardMedia, Grid, Typography} from "@mui/material";
import PetitionsListObject from './PetitionsListObject';
import Navbar from "./Navbar.tsx";
import useUserStore from "../store/UserStore.ts";
import CreatePetition from "./CreatePetition.tsx";

const Petition = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const [currentPetitionId, setCurrentPetitionId] = useState<number | undefined>(undefined);
    const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
    const [ownerId, setOwnerId] = useState<number | undefined>(undefined);
    const [editPetitionOpen, setEditPetitionOpen] = useState(false);
    const [petition, setPetition] = useState<Petition | null>(null);
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [supporters, setSupporters] = useState<Supporter[]>([]);
    const [supportTiers, setSupportTiers] = useState<SupportTier[]>([]);
    const [similarPetitions, setSimilarPetitions] = useState<Petition[]>([]);
    const { userId } = useUserStore((state) => state);

    useEffect(() => {
        const getPetition = () => {
            axios.get(`http://localhost:4941/api/v1/petitions/${id}`)
                .then((response) => {
                    setPetition(response.data);
                    setSupportTiers(response.data.supportTiers);
                    setErrorFlag(false);
                    updateSimilarPetitions(response.data.petitionId, response.data.categoryId, response.data.ownerId);
                })
                .catch((error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString() + " Error fetching petition");
                });
        };

        const getSupporters = () => {
            axios.get(`http://localhost:4941/api/v1/petitions/${id}/supporters`)
                .then((response) => {
                    setSupporters(response.data);
                    setErrorFlag(false);
                })
                .catch((error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString() + " Error fetching supporters");
                });
        };

        const updateSimilarPetitions = (currentPetitionId: number, categoryId: number, ownerId: number) => {
            setCurrentPetitionId(currentPetitionId);
            setCategoryId(categoryId);
            setOwnerId(ownerId);
            getSimilarPetitions(currentPetitionId, categoryId, ownerId);
        };

        getPetition();
        getSupporters();
    }, [id, location.state]);

    const getSimilarPetitions = (currentPetitionId: number, categoryId: number, ownerId: number) => {
        Promise.all([
            axios.get('http://localhost:4941/api/v1/petitions', {
                params: {
                    categoryIds: [categoryId],
                },
            }),
            axios.get('http://localhost:4941/api/v1/petitions', {
                params: {
                    ownerId: ownerId,
                },
            }),
        ])
            .then((responses) => {
                const categoryIdPetitions = responses[0].data.petitions;
                const ownerIdPetitions = responses[1].data.petitions;

                const uniquePetitions: Petition[] = [];
                const seenPetitions: Set<number> = new Set();

                [...categoryIdPetitions, ...ownerIdPetitions].forEach((petition) => {
                    if (!seenPetitions.has(petition.petitionId) && petition.petitionId !== currentPetitionId) {
                        seenPetitions.add(petition.petitionId);
                        uniquePetitions.push(petition);
                    }
                });

                setSimilarPetitions(uniquePetitions);
                setErrorFlag(false);
            })
            .catch((error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString() + " Error fetching all petitions");
            });
    };

    const getSupportTierName = (supportTierId: number) => {
        const supportTier = supportTiers.find((tier) => tier.supportTierId === supportTierId);
        return supportTier ? supportTier.title : 'Unknown';
    };

    const handleEditPetition = () => {
        setEditPetitionOpen(true);
    };

    const handleCloseEditPetition = () => {
        window.location.reload();
        setEditPetitionOpen(false);

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
                    textAlign: 'center'
                }}>
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage}
                </Alert>
            )}
            {!errorFlag && !editPetitionOpen && petition && (
                <>
                    <Card sx={petitionCardStyles}>
                        <Navbar />
                    </Card>
                    <Card sx={petitionCardStyles}>
                        <CardMedia
                            component="img"
                            height="400"
                            image={`http://localhost:4941/api/v1/petitions/${petition.petitionId}/image` || 'https://via.placeholder.com/400x200'}
                            alt={petition.title}
                        />

                        <CardContent>
                            <Typography variant="h3">
                                {petition.title}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {petition.description}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '5px', justifyContent: 'center' }}>
                                Owner:
                                <Avatar
                                    src={`https://seng365.csse.canterbury.ac.nz/api/v1/users/${petition.ownerId}/image`}
                                    alt={`${petition.ownerFirstName} ${petition.ownerLastName}`}
                                    sx={{ marginRight: '8px', marginLeft: '10px' }}
                                />
                                <Typography variant="body1">
                                    {petition.ownerFirstName} {petition.ownerLastName}
                                </Typography>
                            </Box>
                            <Typography variant="body1" color="text.secondary">
                                Creation Date: {new Date(petition.creationDate).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Number of Supporters: {petition.numberOfSupporters}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Total Money Raised: ${petition.moneyRaised|| 0}
                            </Typography>
                            <Typography variant="h4" component="div" sx={{ marginTop: '20px' }}>
                                Support Tiers:
                            </Typography>
                            <Grid container spacing={2} justifyContent='center' >
                                {petition.supportTiers.map((tier) => (
                                    <Grid item xs={6} key={tier.supportTierId} >
                                        <Card sx={{ marginBottom: '10px', marginTop: '10px', minHeight: '150px', boxShadow: "0 0 0 0 rgba(0, 0, 0, 0.2), 0 0 10px 0 rgba(0, 0, 0, 0.19)" }}>
                                            <CardContent>
                                                <Typography variant="h5" component="div" >
                                                    {tier.title}
                                                </Typography>
                                                <Typography variant="body1" color="text.secondary">
                                                    {tier.description}
                                                </Typography>
                                                <Typography variant="body1" color="text.secondary">
                                                    Cost: ${tier.cost}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>

                            <Grid container spacing={2} justifyContent='center' sx={{minHeight: '200px'}}>
                                <Typography variant="h4" component="div" sx={{ marginTop: '20px' }}>
                                    Supporters:
                                </Typography>
                                <Grid container spacing={2} justifyContent="center">
                                    {supporters.length === 0 && (
                                        <Typography variant="h6" sx={{ marginTop: '20px' }}>
                                            There are no supporters
                                        </Typography>
                                    )}
                                    {supporters.map((supporter) => (
                                        <Grid item xs={6} sm={3} key={supporter.supportId}>
                                            <Card sx={{ marginBottom: '10px', marginTop: '10px', boxShadow: "0 0 0 0 rgba(0, 0, 0, 0.2), 0 0 10px 0 rgba(0, 0, 0, 0.19)" }}>
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                        <Avatar
                                                            src={`https://seng365.csse.canterbury.ac.nz/api/v1/users/${supporter.supporterId}/image`}
                                                            alt={`${supporter.supporterFirstName} ${supporter.supporterLastName}`}
                                                            sx={{ marginRight: '8px' }}
                                                        />
                                                        <Typography variant="body1">
                                                            {supporter.supporterFirstName} {supporter.supporterLastName}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body1" color="text.secondary">
                                                        Message: {supporter.message || 'No message provided'}
                                                    </Typography>
                                                    <Typography variant="body1" color="text.secondary">
                                                        Tier: {getSupportTierName(supporter.supportTierId)} tier on {new Date(supporter.timestamp).toLocaleDateString()}
                                                    </Typography>
                                                    <Typography variant="body1" color="text.secondary">
                                                        Supported on: {new Date(supporter.timestamp).toLocaleDateString()}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                                <Box>
                                    {userId === petition?.ownerId && (
                                        <Button variant="contained" color="primary" onClick={handleEditPetition}>
                                            Edit Petition
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                        </CardContent>
                    </Card>
                    <Card sx={petitionCardStyles}>
                        <Typography variant="h4" component="div" sx={{ marginTop: '20px', minHeight: '100px' }}>
                            Similar Petitions:
                        </Typography>
                        {similarPetitions.length > 0 ? (
                            <Grid container spacing={2} sx={{ alignItems: 'center', justifyContent: 'center' }} >
                                {similarPetitions.map((petition) => (
                                    <Grid sx={{ padding: '5px' }}>
                                        <PetitionsListObject
                                            petition={petition}
                                            currentPetitionId={currentPetitionId || petition.petitionId}
                                            categoryId={categoryId || petition.categoryId}
                                            ownerId={ownerId || petition.ownerId}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Box sx={{ justifyContent: 'center', alignItems: 'center', minHeight: '50px' }}>
                                <Typography variant="h5" sx={{ padding: '20px' }}>
                                    No similar petitions
                                </Typography>
                            </Box>
                        )}
                    </Card>
                </>
            )}
            {editPetitionOpen && petition && (
                <CreatePetition
                    isEditing
                    petitionDataPassed={petition}
                    onClose={handleCloseEditPetition}
                />
            )}
        </Card>
    );
};
export default Petition;