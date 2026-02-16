import React from 'react';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import './Filters.css';

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
    <Box className="filters-container">
      <Box className="filter-input-group">
        <label className="filter-label">
          <i className="fas fa-calendar-alt"></i> Start Date
        </label>
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => handleChange('startDate', e.target.value)}
          className="filter-input"
        />
      </Box>
      <Box className="filter-input-group">
        <label className="filter-label">
          <i className="fas fa-calendar-alt"></i> End Date
        </label>
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => handleChange('endDate', e.target.value)}
          className="filter-input"
        />
      </Box>
      <Box className="filter-input-group">
        <label className="filter-label">
          <i className="fas fa-tags"></i> Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="filter-select"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </Box>
      <Box className="filter-input-group">
        <label className="filter-label">
          <i className="fas fa-globe"></i> Region
        </label>
        <select
          value={filters.region}
          onChange={(e) => handleChange('region', e.target.value)}
          className="filter-select"
        >
          <option value="">All Regions</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </Box>
    </Box>
  );
};

export default Filters;
