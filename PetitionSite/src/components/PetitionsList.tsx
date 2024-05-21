import axios from 'axios';
import React, {useEffect, useState} from "react";
import CSS from 'csstype';
import TuneIcon from '@mui/icons-material/Tune';
import {
    Paper,
    AlertTitle,
    Alert,
    Grid,
    TextField,
    Box,
    Typography,
    MenuItem,
    Menu,
    IconButton, Pagination
} from "@mui/material";
import PetitionsListObject from "./PetitionsListObject";
const PetitionsList = () => {
    const [petitions, setPetitions] = useState<Array<Petition>>([]);
    const [searchParams, setSearchParams] = useState<PetitionSearchParameters>({sortBy: 'CREATED_ASC',startIndex: 0, count: 10});
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [totalPetitions, setTotalPetitions] = useState(0);


    useEffect(() => {
        const getPetitions = () => {
            const params: PetitionSearchParameters = { ...searchParams };
            axios.get('http://localhost:4941/api/v1/petitions', { params })
                .then((response) => {
                    setErrorFlag(false);
                    setErrorMessage("");
                    setPetitions(response.data.petitions);
                    setTotalPetitions(response.data.count);
                })
                .catch((error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString() + " defaulting to old petitions changes app may not work as expected");
                });
        };
        getPetitions();
    }, [searchParams]);


    const petition_rows = () => petitions.map((petition: Petition) => <PetitionsListObject key={petition.petitionId + petition.title} petition={petition} />);

    const handleSearch = () => {
        const searchTerm = document.getElementById("search-input") as HTMLInputElement;
        if (searchTerm.value.trim() === '') {
            setSearchParams({});
        } else {
            setSearchParams({ q: searchTerm.value });
        }
    };

    const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleFilterClose = () => {
        setAnchorEl(null);
    };

    const handleSortChange = (sortOption: string) => {
        setSearchParams({sortBy: sortOption});
        handleFilterClose();
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setSearchParams({ ...searchParams, startIndex: (value - 1) * searchParams.count! });
    }
    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
        width: "1700px",
        minHeight: "100px",
    };

    const box: CSS.Properties = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "20px",
    }

    //TODO: FIX BUG, After sorting, pagination breaks

    return (
        <Grid>
            <Paper elevation={3} style={card}>
                <h1>PetitionsList </h1>
                <div>
                    <Box style={box}>
                        <TextField id="search-input" label="Search Petitions" variant="outlined" onChange={handleSearch}/>
                        <IconButton onClick={handleFilterClick} >
                            <TuneIcon/>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleFilterClose}
                        >
                            <MenuItem onClick={() => handleSortChange('ALPHABETICAL_ASC')}>Ascending alphabetically</MenuItem>
                            <MenuItem onClick={() => handleSortChange('ALPHABETICAL_DESC')}>Descending alphabetically</MenuItem>
                            <MenuItem onClick={() => handleSortChange('COST_ASC')}>Ascending by supporting cost</MenuItem>
                            <MenuItem onClick={() => handleSortChange('COST_DESC')}>Descending by supporting cost</MenuItem>
                            <MenuItem onClick={() => handleSortChange('CREATED_ASC')}>Chronologically by creation date</MenuItem>
                            <MenuItem onClick={() => handleSortChange('CREATED_DESC')}>Reverse Chronologically by creation date</MenuItem>
                        </Menu>
                    </Box>
                    <Box style={box}>
                        <Pagination
                            count={Math.ceil(totalPetitions / searchParams.count!)}
                            onChange={handlePageChange}
                            shape="rounded"
                        />
                    </Box>
                    {errorFlag ? (
                        <Alert severity="error">
                            <AlertTitle>Error</AlertTitle>
                            {errorMessage}
                        </Alert>
                    ) : petitions.length === 0 ? (
                        <Typography variant="body1" align="center" sx={{ padding: "20px" }}>
                            No petitions for the given search
                        </Typography>
                    ) : (
                        petition_rows()
                        )
                    }
                </div>
            </Paper>
        </Grid>
    );
};

export default PetitionsList;