import axios from 'axios';
import React, { useEffect, useState} from "react";
import CSS from 'csstype';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import {
    AlertTitle,
    Alert,
    TextField,
    Box,
    Typography,
    MenuItem,
    Menu, Pagination, Autocomplete, Button, Card
} from "@mui/material";
import PetitionsListObject from "./PetitionsListObject";
import Navbar from './Navbar';



const PetitionsList = () => {
    const [petitions, setPetitions] = useState<Array<Petition>>([]);
    const [searchParams, setSearchParams] = useState<PetitionSearchParameters>({ sortBy: 'CREATED_ASC', startIndex: 0, count: 8 });
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [sortAnchor, setSortAnchor] = useState<null | HTMLElement>(null);
    const [totalPetitions, setTotalPetitions] = useState(0);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [supportingCost, setSupportingCost] = useState<number | undefined>(undefined);


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

    const petition_rows = () => petitions.map((petition: Petition) => <PetitionsListObject key={petition.petitionId + petition.title} petition={petition}  categoryId={petition.categoryId} currentPetitionId={petition.petitionId} ownerId={petition.ownerId}/>);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };


    const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setSortAnchor(event.currentTarget);
    };

    const handleFilterClose = () => {
        setSortAnchor(null);
    };

    const handleSortChange = (sortOption: string) => {
        setSearchParams({ ...searchParams, sortBy: sortOption, startIndex: 0 });
        handleFilterClose();
    };

    const handleCategoryChange = (_event: React.SyntheticEvent, value: Category[]) => {
        setSelectedCategories(value.map((category) => category.categoryId));
    };

    const handleSupportingCostChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value ? parseInt(event.target.value) : undefined;
        setSupportingCost(value);
    };

    const handleApplyFilters = () => {
        let params: PetitionSearchParameters = { startIndex: 0, count: 8 };
        if (searchTerm.trim() !== '') {
            params = { ...params, q: searchTerm, startIndex: 0 };
        }
        if (selectedCategories.length > 0) {
            params = { ...params, categoryIds: selectedCategories, startIndex: 0 };
        }
        if (supportingCost !== undefined) {
            params = { ...params, supportingCost, startIndex: 0 };
        }
        setSearchParams(params);
    };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setSearchParams({ ...searchParams, startIndex: (value - 1) * searchParams.count! });
    };

    //TODO: make clear actually clear the search boxStyles
    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedCategories([]);
        setSupportingCost(undefined);
        setSearchParams({ sortBy: 'CREATED_ASC', startIndex: 0, count: 8 });
    };


    const boxStyles: CSS.Properties = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "20px",
    };

    const petitionCardStyles: CSS.Properties = {
        width: "1700px",
        margin: "10px",
        padding: "0px",
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    };

    return (
        <Card>
            <Card sx={petitionCardStyles}>
                <Navbar />
            </Card>
            <Card elevation={3} style={petitionCardStyles}>
                <h1>PetitionsList </h1>
                <div>
                    <Box style={boxStyles}>
                        <TextField id="search-input" label="Search Petitions" variant="outlined" onChange={handleSearch} />
                        <Button onClick={handleFilterClick} variant="contained" startIcon={<SwapVertIcon />} sx = {{margin: '10px'}}>
                            Sort
                        </Button>
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
                    </Box>
                    <Box style={boxStyles} sx={{ minWidth: '800px' }}>
                        <Autocomplete
                            multiple
                            id="category-filter"
                            options={categories}
                            getOptionLabel={(option) => option.name}
                            value={categories.filter((c) => selectedCategories.includes(c.categoryId))}
                            onChange={handleCategoryChange}
                            sx={{ minWidth: '300px' }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Filter by Categories"
                                    placeholder="Select categories"
                                />
                            )}
                        />
                        <TextField
                            id="supporting-cost-filter"
                            label="Max Supporting Cost"
                            type="number"
                            value={supportingCost || ''}
                            sx={{ marginLeft: '10px' }}
                            onChange={handleSupportingCostChange}
                        />
                        <Button variant="contained" onClick={handleApplyFilters} sx={{ marginLeft: '10px' }}>
                            Apply
                        </Button>
                        <Button variant="outlined" onClick={handleClearFilters} sx={{marginLeft: '10px'}}>
                            Clear
                        </Button>
                    </Box>
                    <Box style={boxStyles}>
                        <Pagination
                            count={Math.ceil(totalPetitions / searchParams.count!)}
                            onChange={handlePageChange}
                            shape="rounded"
                            showFirstButton
                            showLastButton
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
                    )}
                </div>
            </Card>
        </Card>

    );
};

export default PetitionsList;