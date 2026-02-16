import React from 'react';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';

const TotalSalesCard = ({ data, loading }) => {
  if (loading && !data) {
    return (
      <Paper sx={{ p: 3, height: '100%' }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num || 0);
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Total Sales & Revenue
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AttachMoneyIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total Revenue
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {formatCurrency(data?.totalRevenue)}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ShoppingCartIcon sx={{ mr: 2, color: 'success.main' }} />
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total Quantity
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {formatNumber(data?.totalQuantity)}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ReceiptIcon sx={{ mr: 2, color: 'warning.main' }} />
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total Transactions
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {formatNumber(data?.totalTransactions)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default TotalSalesCard;
