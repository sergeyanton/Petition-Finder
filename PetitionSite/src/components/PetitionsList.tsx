import axios from 'axios';
import React from "react";
import CSS from 'csstype';
import { Paper, AlertTitle, Alert } from "@mui/material";
import PetitionsListObject from "./PetitionsListObject";

const PetitionsList = () => {
    const [petitions, setPetitions] = React.useState<Array<Petition>>([]);
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    React.useEffect(() => {
        const getPetitions = () => {
            axios.get('http://localhost:4941/api/v1/petitions')
                .then((response) => {
                    setErrorFlag(false);
                    setErrorMessage("");
                    setPetitions(response.data.petitions);
                })
                .catch((error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString() + " defaulting to old petitions changes app may not work as expected");
                });
        };
        getPetitions();
    }, [setPetitions]);

    const petition_rows = () => petitions.map((petition: Petition) => <PetitionsListObject key={petition.petitionId + petition.title} petition={petition} />);

    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
        width: "100%"
    };

    return (
        <Paper elevation={3} style={card}>
            <h1>PetitionsList </h1>
            <div>
                {errorFlag ? (
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>
                ) : ""}
                {petition_rows()}
            </div>
        </Paper>
    );
}

export default PetitionsList;