import React, { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  Typography,
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
import './Dashboard.css';

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

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const displayDateRange = () => {
    if (filters.startDate && filters.endDate) {
      return `${formatDate(filters.startDate)} - ${formatDate(filters.endDate)}`;
    }
    return 'All dates';
  };

  return (
    <Box className="dashboard">
      {/* Header */}
      <Box className="header-row">
        <Box className="logo-area">
          <Typography variant="h1" className="logo-title">
            <i className="fas fa-bolt"></i>Sales & Revenue Analytics
          </Typography>
          <Box sx={{ display: 'flex', gap: '10px', marginTop: '8px', flexWrap: 'wrap' }}>
            <span className="badge-live">
              <span className="pulse-dot"></span> live · streaming
            </span>
            <span className="badge-live" style={{ borderColor: '#8866ff' }}>
              <i className="far fa-clock"></i> {new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
            </span>
          </Box>
        </Box>
        <Box className="upload-glow">
          <FileUpload />
        </Box>
      </Box>

      {/* Filter Bar */}
      <Box className="filter-bar glass-panel" sx={{ mb: 3 }}>
        <Filters filters={filters} onFilterChange={handleFilterChange} />
        {totalSalesRevenue && (
          <Box sx={{ marginLeft: 'auto' }} className="chip-cyber">
            <i className="fas fa-check-circle" style={{ color: '#3eff9e' }}></i> {totalSalesRevenue.totalTransactions?.toLocaleString() || 0} rows
          </Box>
        )}
      </Box>

      {/* Metrics Grid */}
      <Grid container spacing={3} className="metrics-grid">
        <Grid item xs={12} sm={6} md={3}>
          <TotalSalesCard data={totalSalesRevenue} loading={loading} metricType="revenue" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TotalSalesCard data={totalSalesRevenue} loading={loading} metricType="sales" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TotalSalesCard data={totalSalesRevenue} loading={loading} metricType="avgOrder" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TotalSalesCard data={totalSalesRevenue} loading={loading} metricType="topRegion" revenueByRegion={revenueByRegion} />
        </Grid>
      </Grid>

      {/* Charts Grid */}
      <Grid container spacing={3} className="chart-grid-2col">
        <Grid item xs={12} md={8}>
          <Box className="chart-panel glass-panel">
            <Box className="chart-header">
              <Typography variant="h3" className="chart-title">
                <i className="fas fa-wave-square"></i> Revenue Trend (Daily)
              </Typography>
              <Box className="legend-dots">
                <span className="dot-item">
                  <span style={{ background: '#3b9eff', width: '10px', height: '10px', borderRadius: '4px', display: 'inline-block' }}></span> 2026
                </span>
              </Box>
            </Box>
            <RevenueTrendChart data={salesTrend} loading={loading} />
            <Box sx={{ display: 'flex', gap: '12px', marginTop: '18px', paddingLeft: '10px' }}>
              <span className="filter-tag" style={{ padding: '6px 20px' }}>daily</span>
              <span className="filter-tag" style={{ padding: '6px 20px' }}>weekly</span>
              <span className="filter-tag" style={{ padding: '6px 20px' }}>monthly</span>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box className="chart-panel glass-panel">
            <Box className="chart-header">
              <Typography variant="h3" className="chart-title">
                <i className="fas fa-chart-bar"></i> Product Wise Sales
              </Typography>
            </Box>
            <ProductWiseSalesChart data={productWiseSales} loading={loading} />
          </Box>
        </Grid>
      </Grid>

      {/* Bottom Section */}
      <Grid container spacing={3} className="bottom-duo">
        <Grid item xs={12} md={7}>
          <Box className="insight-card glass-panel">
            <Typography variant="h3" className="title-sm">
              <i className="fas fa-chart-pie" style={{ color: '#fe8b7b' }}></i> Revenue By Region
            </Typography>
            <RevenueByRegionChart data={revenueByRegion} loading={loading} />
          </Box>
        </Grid>
        <Grid item xs={12} md={5}>
          <Box className="insight-card glass-panel" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '100%' }}>
            <Typography variant="h3" className="title-sm">
              <i className="fas fa-microchip"></i> Processing & Filters
            </Typography>
            <Box sx={{ background: '#0a1b31', borderRadius: '50px', padding: '22px', border: '1px solid #3268b0', marginTop: '20px' }}>
              <Box sx={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <span className="filter-tag" style={{ background: '#0a2342' }}>
                  <i className="far fa-calendar-check"></i> {displayDateRange()}
                </span>
                {filters.category && (
                  <span className="filter-tag" style={{ background: '#0a2342' }}>
                    <i className="fas fa-tag"></i> {filters.category}
                  </span>
                )}
                {filters.region && (
                  <span className="filter-tag" style={{ background: '#0a2342' }}>
                    <i className="fas fa-globe"></i> {filters.region}
                  </span>
                )}
              </Box>
              {loading ? (
                <Box className="shimmer floating">
                  <Box className="spinner-advanced"></Box> synchronizing with node · postgres
                </Box>
              ) : (
                <Typography sx={{ marginTop: '20px', color: '#9abde0', fontSize: '0.95rem' }}>
                  <i className="fas fa-check-circle" style={{ color: '#3eff9e' }}></i>
                  {' '}CSV processed · {totalSalesRevenue?.totalTransactions?.toLocaleString() || 0} records · 0 errors
                </Typography>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Footer */}
      <Box sx={{ marginTop: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <Box className="deploy-badge"
          component="a"
          href="https://sales-revenue-analytics-dashboard-1.onrender.com"
          target="_blank"
          rel="noopener noreferrer">
          <i className="fas fa-rocket"></i> live demo · deployed on render (bonus)
        </Box>
        <Box
          sx={{
            color: '#a0b5d9',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px' 
          }}
          component="a"
          href="https://github.com/Abinashmotract/Sales-Revenue-Analytics-Dashboard.git"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-github"></i>
          <span>Sales & Revenue Analytics</span>
        </Box>

      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={importStatus === 'error' || error ? 'error' : 'success'}
          sx={{
            width: '100%',
            backgroundColor: importStatus === 'error' || error ? 'rgba(238, 102, 102, 0.2)' : 'rgba(0, 230, 150, 0.2)',
            color: '#fff',
            border: `1px solid ${importStatus === 'error' || error ? '#ee6666' : '#00e6a0'}`,
            backdropFilter: 'blur(10px)'
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;
