import React, {useState,useEffect} from "react";
import {Avatar, Card, CardActionArea, CardContent, CardMedia, Typography} from "@mui/material";
import axios from "axios";
import CSS from 'csstype';
// import {Card, CardContent, CardMedia, Typography} from "@mui/material";


interface IPetitionsProps {
    petition: Petition;
}

const PetitionsListObject = (props: IPetitionsProps) => {
    const [petition] = React.useState< Petition >(props.petition);
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [category, setCategory] = useState<Category | null>(null);
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
        }
        getCategory();
        getPetitionImage();
    }, [petition.petitionId,petition.categoryId]);




    const petitionCardStyles: CSS.Properties = {
        display: "inline-block",
        width: "400px",
        margin: "10px",
        padding: "0px"
    };
    const categoryColors = [
        "#FF6B6B", "#FFD166", "#e516ff", "#56CCF2", "#9B51E0", "#F2994A", "#EB5757", "#2F80ED", "#27AE60", "#BB6BD9", "#33ffe6", "#caff33"
    ];
    if (errorFlag)  {
        return (
            <div style={{color: "red"}}>
                {errorMessage}
            </div>
        )
    } else {
        return (
            <Card sx={petitionCardStyles}>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        height="200"
                        image={imageUrl || "https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png"}
                        alt={petition.title}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {petition.title}
                        </Typography>
                        {category && (
                            <Typography variant="body2" color="text.secondary" sx={{ backgroundColor: categoryColors[category.categoryId % categoryColors.length], padding: "2px 4px", borderRadius: "4px", display: "inline-block" }}>
                                {category.name}
                            </Typography>
                        )}
                        <Typography variant="body2" color="text.secondary">
                            Creation Date: {new Date(petition.creationDate).toLocaleDateString()}
                        </Typography>

                        <div style={{display: "flex", alignItems: "center"}}>
                            {`https://seng365.csse.canterbury.ac.nz/api/v1/users/${petition.ownerId}/image` && (
                                <Avatar
                                    src={`https://seng365.csse.canterbury.ac.nz/api/v1/users/${petition.ownerId}/image`}
                                    alt={`${petition.ownerFirstName} ${petition.ownerLastName}`}
                                    sx={{marginRight: "8px"}}
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