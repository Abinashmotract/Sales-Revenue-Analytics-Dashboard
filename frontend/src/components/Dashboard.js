import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTotalSalesRevenue,
  fetchSalesTrend,
  fetchProductWiseSales,
  fetchRevenueByRegion,
  clearError,
  clearImportStatus,
} from '../store/slices/salesSlice';
import FileUpload from './FileUpload';
import Filters from './Filters';
import RevenueTrendChart from './RevenueTrendChart';
import ProductWiseSalesChart from './ProductWiseSalesChart';
import RevenueByRegionChart from './RevenueByRegionChart';
import TotalSalesCard from './TotalSalesCard';

const Dashboard = () => {
  const dispatch = useDispatch();
  const {
    totalSalesRevenue,
    salesTrend,
    productWiseSales,
    revenueByRegion,
    loading,
    error,
    importStatus,
  } = useSelector((state) => state.sales);

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    category: '',
    region: '',
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    if (importStatus === 'success') {
      setSnackbarMessage('Sales data imported successfully!');
      setSnackbarOpen(true);
      dispatch(clearImportStatus());
      loadDashboardData();
    } else if (importStatus === 'error') {
      setSnackbarMessage('Failed to import sales data');
      setSnackbarOpen(true);
      dispatch(clearImportStatus());
    }
  }, [importStatus, dispatch]);

  useEffect(() => {
    if (error) {
      setSnackbarMessage(error.message || 'An error occurred');
      setSnackbarOpen(true);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const loadDashboardData = () => {
    const filterParams = {
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
      category: filters.category || undefined,
      region: filters.region || undefined,
    };

    dispatch(fetchTotalSalesRevenue(filterParams));
    dispatch(fetchSalesTrend({ ...filterParams, period: 'daily' }));
    dispatch(fetchProductWiseSales(filterParams));
    dispatch(fetchRevenueByRegion(filterParams));
  };

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* File Upload Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Import Sales Data
            </Typography>
            <FileUpload />
          </Paper>
        </Grid>

        {/* Filters Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Filters filters={filters} onFilterChange={handleFilterChange} />
          </Paper>
        </Grid>

        {/* Total Sales Card */}
        <Grid item xs={12} md={4}>
          <TotalSalesCard data={totalSalesRevenue} loading={loading} />
        </Grid>

        {/* Loading Indicator */}
        {loading && (
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          </Grid>
        )}

        {/* Revenue Trend Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Revenue Trends Over Time
            </Typography>
            <RevenueTrendChart data={salesTrend} loading={loading} />
          </Paper>
        </Grid>

        {/* Product-wise Sales Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Product-wise Sales
            </Typography>
            <ProductWiseSalesChart data={productWiseSales} loading={loading} />
          </Paper>
        </Grid>

        {/* Revenue by Region Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Revenue by Region
            </Typography>
            <RevenueByRegionChart data={revenueByRegion} loading={loading} />
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={importStatus === 'error' || error ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;
