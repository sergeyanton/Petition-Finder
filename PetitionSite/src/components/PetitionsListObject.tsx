import React, {useState,useEffect} from "react";
import {Card, CardActionArea, CardContent, CardMedia, Typography} from "@mui/material";
import axios from "axios";
import CSS from 'csstype';
// import {Card, CardContent, CardMedia, Typography} from "@mui/material";


interface IPetitionsProps {
    petition: Petition;
}

const PetitionsListObject = (props: IPetitionsProps) => {
    const [petition] = React.useState< Petition >(props.petition);
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
    const [owner, setPetitionOwner] = useState<User| undefined>(undefined);
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

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

        const getOwner = () => {
            axios.get(`http://localhost:4941/api/v1/users/${petition.ownerId}`)
                .then((response) => {
                    setPetitionOwner(response.data);
                })
                .catch((error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                });
        };
        getPetitionImage();
        getOwner();

    }, [petition.petitionId,petition.ownerId]);




    const petitionCardStyles: CSS.Properties = {
        display: "inline-block",
        width: "400px",
        margin: "10px",
        padding: "0px"
    };
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
                        <Typography variant="body2" color="text.secondary">
                            Creation Date: {petition.creationDate}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Owner: {owner?.firstName} {owner?.lastName}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        );
    }

}

export default PetitionsListObject;