import React from 'react';
import {
  Grid,
  TextField,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';

const Filters = ({ filters, onFilterChange }) => {
  const { categories, regions } = useSelector((state) => state.sales);

  const handleChange = (field, value) => {
    const newFilters = {
      ...filters,
      [field]: value,
    };
    onFilterChange(newFilters);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Start Date"
            type="date"
            value={filters.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="End Date"
            type="date"
            value={filters.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            label="Category"
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
            fullWidth
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            label="Region"
            value={filters.region}
            onChange={(e) => handleChange('region', e.target.value)}
            fullWidth
          >
            <MenuItem value="">All Regions</MenuItem>
            {regions.map((region) => (
              <MenuItem key={region} value={region}>
                {region}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Filters;
