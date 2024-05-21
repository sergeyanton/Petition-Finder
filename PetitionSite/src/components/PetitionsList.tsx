import axios from 'axios';
import React, {useEffect, useState} from "react";
import CSS from 'csstype';
import TuneIcon from '@mui/icons-material/Tune';
import SwapVertIcon from '@mui/icons-material/SwapVert';
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
    IconButton, Pagination, Autocomplete, Stack
} from "@mui/material";
import PetitionsListObject from "./PetitionsListObject";
const PetitionsList = () => {
    const [petitions, setPetitions] = useState<Array<Petition>>([]);
    const [searchParams, setSearchParams] = useState<PetitionSearchParameters>({sortBy: 'CREATED_ASC',startIndex: 0, count: 8});
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [sortAnchor, setSortAnchor] = useState<null | HTMLElement>(null);
    const [categoryAnchor, setCategoryAnchor] = useState<null | HTMLElement>(null);
    const [totalPetitions, setTotalPetitions] = useState(0);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);


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

        const getCategories = () => {
            axios.get('http://localhost:4941/api/v1/petitions/categories')
                .then((response) => {
                    setCategories(response.data);
                })
                .catch((error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                });
        };
        getCategories();
        getPetitions();
    }, [searchParams]);


    const petition_rows = () => petitions.map((petition: Petition) => <PetitionsListObject key={petition.petitionId + petition.title} petition={petition} />);

    const handleSearch = () => {
        const searchTerm = document.getElementById("search-input") as HTMLInputElement;
        if (searchTerm.value.trim() === '') {
            setSearchParams({ startIndex: 0, count: 8 });
        } else {
            setSearchParams({ q: searchTerm.value });
        }
    };

    const handleFilterOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setSortAnchor(event.currentTarget);
    };
    const handleFilterClose = () => {
        setSortAnchor(null);
        setCategoryAnchor(null);
    };

    const handleSortChange = (sortOption: string) => {
        setSearchParams({ ...searchParams, sortBy: sortOption, startIndex: 0 });
        handleFilterClose();
    };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setSearchParams({ ...searchParams, startIndex: (value - 1) * searchParams.count! });
    }

    const handleCategoryChange = (_event: React.SyntheticEvent, value: Category[]) => {
        setSelectedCategories(value.map(c => c.categoryId));
        setSearchParams({ ...searchParams, categoryIds: value.map(c => c.categoryId), startIndex: 0 });
        handleFilterClose();
    };

    const handleCategoryClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setCategoryAnchor(event.currentTarget);
    };

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
                        <IconButton onClick={handleFilterOpen} >
                            <SwapVertIcon/>
                        </IconButton>
                        <Menu
                            anchorEl={sortAnchor}
                            open={Boolean(sortAnchor)}
                            onClose={handleFilterClose}
                        >
                            <MenuItem onClick={() => handleSortChange('ALPHABETICAL_ASC')}>Ascending alphabetically</MenuItem>
                            <MenuItem onClick={() => handleSortChange('ALPHABETICAL_DESC')}>Descending alphabetically</MenuItem>
                            <MenuItem onClick={() => handleSortChange('COST_ASC')}>Ascending by supporting cost</MenuItem>
                            <MenuItem onClick={() => handleSortChange('COST_DESC')}>Descending by supporting cost</MenuItem>
                            <MenuItem onClick={() => handleSortChange('CREATED_ASC')}>Chronologically by creation date</MenuItem>
                            <MenuItem onClick={() => handleSortChange('CREATED_DESC')}>Reverse Chronologically by creation date</MenuItem>
                        </Menu>
                        <IconButton onClick={handleCategoryClick} >
                            <TuneIcon />
                        </IconButton>
                        <Menu
                            anchorEl={categoryAnchor}
                            open={Boolean(categoryAnchor)}
                            onClose={handleFilterClose}
                        >
                            <Stack spacing={3} sx={{ width: 500, padding: 2 }}>
                                <Autocomplete
                                    multiple
                                    id="category-filter"
                                    options={categories}
                                    getOptionLabel={(option) => option.name}
                                    value={categories.filter(c => selectedCategories.includes(c.categoryId))}
                                    onChange={handleCategoryChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="standard"
                                            label="Filter by Categories"
                                            placeholder="Select categories"
                                        />
                                    )}
                                />
                            </Stack>
                        </Menu>
                    </Box>
                    <Box style={box}>
                        <Pagination
                            count={Math.ceil(totalPetitions / searchParams.count!)}
                            onChange={handlePageChange}
                            shape="rounded"
                            showFirstButton showLastButton
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