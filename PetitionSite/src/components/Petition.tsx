import  { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CSS from 'csstype';
import { Alert, AlertTitle, Avatar, Box, Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import PetitionsListObject from './PetitionsListObject';

const Petition = () => {
    const { id } = useParams<{ id: string }>();
    const [petition, setPetition] = useState<Petition | null>(null);
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [supporters, setSupporters] = useState<Supporter[]>([]);
    const [supportTiers, setSupportTiers] = useState<SupportTier[]>([]);
    const [allPetitions, setAllPetitions] = useState<Petition[]>([]);

    useEffect(() => {
        const getPetition = () => {
            axios.get(`http://localhost:4941/api/v1/petitions/${id}`)
                .then((response) => {
                    setPetition(response.data);
                    setSupportTiers(response.data.supportTiers);
                    setErrorFlag(false);
                    getAllPetitions();

                })
                .catch((error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString() +" Error fetching petition");
                });
        };

        const getSupporters = () => {
            axios.get(`http://localhost:4941/api/v1/petitions/${id}/supporters`)
                .then((response) => {
                    setSupporters(response.data);
                })
                .catch((error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString() + " Error fetching supporters");
                });
        };

        const getAllPetitions = () => {
            axios.get(`http://localhost:4941/api/v1/petitions`)
                .then((response) => {
                    setAllPetitions(response.data.petitions);
                })
                .catch((error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString() + " Error fetching all petitions");
                });
        };



        getPetition();
        getSupporters();
    }, [id]);


//TODO: fix similar petitions, currently if click similar petition, it will have itself as similar petition.
    const getSimilarPetitions = () => {
        if (id !== undefined && petition) {
            return allPetitions.filter((p: Petition) => {
                return (p.petitionId != +id) && (
                    p.categoryId === petition?.categoryId || p.ownerId === petition?.ownerId
                );
            });
        } else {
            return [];
        }
    };
    const getSupportTierName = (supportTierId: number) => {
        const supportTier = supportTiers.find((tier) => tier.supportTierId === supportTierId);
        return supportTier ? supportTier.title : 'Unknown';
    };

    const petitionCardStyles1: CSS.Properties = {
        width: "1000px",
        margin: "10px",
        padding: "0px",
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    };

    return (
        <Card>
            {errorFlag && (
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage}
                </Alert>
            )}
            {!errorFlag && petition && (
                <>
                    <Card sx={petitionCardStyles1}>
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
                                Total Money Raised: ${petition.moneyRaised}
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
                            <Typography variant="h4" component="div" sx={{ marginTop: '20px' }}>
                                Supporters:
                            </Typography>
                            <Grid container spacing={2} justifyContent="center">
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
                        </CardContent>
                    </Card>
                    <Card sx={petitionCardStyles1}>
                        <Typography variant="h4" component="div" sx={{ marginTop: '20px', minHeight: '100px' }}>
                            Similar Petitions:
                        </Typography>
                        {getSimilarPetitions().length > 0 ? (
                            <Grid container spacing={2} sx={{alignItems: 'center', justifyContent: 'center' }} >
                                {getSimilarPetitions().map((petition) => (
                                    <Grid sx={{padding: '5px' }}>
                                        <PetitionsListObject petition={petition} />
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Typography variant="h5" sx={{ padding: '20px', alignItems: 'center', justifyContent: 'center' }}>
                                No similar petitions
                            </Typography>
                        )}
                    </Card>
                </>
            )}
        </Card>
    );
};
export default Petition;