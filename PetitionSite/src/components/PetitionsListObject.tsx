import React, { useState, useEffect } from "react";
import { Avatar, Box, Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";
import axios from "axios";
import CSS from 'csstype';
import { useNavigate } from "react-router-dom";

interface IPetitionsProps {
    petition: Petition;
    currentPetitionId: number;
    categoryId: number;
    ownerId: number;
}

const PetitionsListObject = ({ petition, currentPetitionId, categoryId, ownerId }: IPetitionsProps) => {
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
    const [category, setCategory] = useState<Category | null>(null);
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const getPetitionImage = () => {
            axios.get(`http://localhost:4941/api/v1/petitions/${petition.petitionId}/image`)
                .then((response) => {
                    setImageUrl(response.config.url);
                })
                .catch((error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                });
        };

        const getCategory = () => {
            axios.get(`http://localhost:4941/api/v1/petitions/categories`)
                .then((response) => {
                    const foundCategory = response.data.find((c: Category) => c.categoryId === petition.categoryId);
                    setCategory(foundCategory || null);
                })
                .catch((error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                });
        };

        getCategory();
        getPetitionImage();
    }, [petition.petitionId, petition.categoryId]);

    const handlePetitionClick = () => {
        navigate(`/petition/${petition.petitionId}`, {
            state: {
                currentPetitionId,
                categoryId,
                ownerId,
            },
        });
    };

    const petitionCardStyles: CSS.Properties = {
        display: "inline-block",
        width: "400px",
        margin: "10px",
        padding: "0px"
    };

    const categoryColors = [
        "#FF6B6B", "#FFD166", "#e516ff", "#56CCF2", "#9B51E0", "#F2994A", "#EB5757", "#2F80ED", "#27AE60", "#BB6BD9", "#33ffe6", "#caff33"
    ];

    if (errorFlag) {
        return (
            <div style={{ color: "red" }}>
                {errorMessage}
            </div>
        )
    } else {
        return (
            <Card sx={petitionCardStyles} onClick={handlePetitionClick}>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        height="200"
                        image={imageUrl || "https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png"}
                        alt={petition.title}
                    />
                    <CardContent>
                        {category && (
                            <Typography variant="body2" color="text.secondary" sx={{ backgroundColor: categoryColors[category.categoryId % categoryColors.length], padding: "2px 4px", borderRadius: "4px", display: "inline-block", marginBottom: "8px" }}>
                                {category.name}
                            </Typography>
                        )}
                        <Box sx={{ minHeight: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', wordBreak: 'break-word' }}>
                                {petition.title}
                            </Typography>
                        </Box>
                        <Typography variant="subtitle2" color="text.secondary" align="left" >
                            <strong> Creation Date: </strong> {new Date(petition.creationDate).toLocaleDateString('en-GB')}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary" align="left">
                            <strong> Minimum Supporting Cost:</strong> ${petition.supportingCost}
                        </Typography>

                        <div style={{ display: "flex", alignItems: "center", marginTop: '20px'}}>
                            {`http://localhost:4941/api/v1/users/${petition.ownerId}/image` && (
                                <Avatar
                                    src={`http://localhost:4941/api/v1/users/${petition.ownerId}/image`}
                                    sx={{ marginRight: "8px" }}
                                />
                            )}
                            <Typography gutterBottom variant="body1" component="div">
                                {petition.ownerFirstName} {petition.ownerLastName}
                            </Typography>
                        </div>

                    </CardContent>
                </CardActionArea>
            </Card>
        );
    }
}

export default PetitionsListObject;