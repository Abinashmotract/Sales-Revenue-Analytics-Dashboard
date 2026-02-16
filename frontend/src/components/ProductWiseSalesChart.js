import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Box, CircularProgress, Typography } from '@mui/material';

const ProductWiseSalesChart = ({ data, loading }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <Typography color="text.secondary">No data available</Typography>
      </Box>
    );
  }

  // Limit to top 10 products for better visualization
  const topProducts = data.slice(0, 10);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={topProducts} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `$${value.toLocaleString()}`}
        />
        <YAxis
          type="category"
          dataKey="productName"
          tick={{ fontSize: 11 }}
          width={150}
        />
        <Tooltip
          formatter={(value) => formatCurrency(value)}
          labelStyle={{ color: '#000' }}
        />
        <Legend />
        <Bar dataKey="totalRevenue" fill="#8884d8" name="Revenue" />
        <Bar dataKey="totalQuantity" fill="#82ca9d" name="Quantity" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ProductWiseSalesChart;
