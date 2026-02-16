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
  Cell,
} from 'recharts';
import { Box, CircularProgress, Typography } from '@mui/material';

const ProductWiseSalesChart = ({ data, loading }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={240}>
        <CircularProgress sx={{ color: '#3ca9ff' }} />
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={240}>
        <Typography sx={{ color: '#9abde0' }}>No data available</Typography>
      </Box>
    );
  }

  // Limit to top 6 products for better visualization
  const topProducts = data.slice(0, 6).map(item => ({
    ...item,
    shortName: item.productName.length > 15 
      ? item.productName.substring(0, 15) + '...' 
      : item.productName
  }));

  const NEON_COLORS = ['#3f8aff', '#6f5ae2', '#ff7e5f', '#faca60', '#5fc2c0', '#b280df'];

  const formatCurrency = (value) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    }
    return `$${value.toLocaleString()}`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'rgba(0, 26, 51, 0.95)',
            border: '1px solid #3b9eff',
            borderRadius: '12px',
            padding: '12px',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography sx={{ color: '#c0e0ff', fontSize: '0.9rem', fontWeight: 600, marginBottom: '4px' }}>
            {payload[0].payload.productName}
          </Typography>
          <Typography sx={{ color: '#60aaff', fontSize: '0.85rem' }}>
            Revenue: {formatCurrency(payload[0].value)}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={topProducts} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2d4470" opacity={0.5} />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: '#b4d0ff' }}
          stroke="#2d5080"
          tickFormatter={(value) => formatCurrency(value)}
        />
        <YAxis
          type="category"
          dataKey="shortName"
          tick={{ fontSize: 10, fill: '#b4d0ff', fontWeight: 500 }}
          stroke="#2d5080"
          width={120}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="totalRevenue" 
          radius={[0, 12, 12, 0]}
          barSize={30}
        >
          {topProducts.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={NEON_COLORS[index % NEON_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ProductWiseSalesChart;
