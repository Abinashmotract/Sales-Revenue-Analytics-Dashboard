import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { Box, CircularProgress, Typography } from '@mui/material';

const RevenueByRegionChart = ({ data, loading }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={190}>
        <CircularProgress sx={{ color: '#3ca9ff' }} />
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={190}>
        <Typography sx={{ color: '#9abde0' }}>No data available</Typography>
      </Box>
    );
  }

  const NEON_COLORS = ['#3f8aff', '#fac858', '#ee6666', '#5fc2c0', '#b280df', '#ff7e5f'];

  const formatCurrency = (value) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    }
    return `$${value.toLocaleString()}`;
  };

  const chartData = data.map((item) => ({
    name: item.region,
    value: item.totalRevenue,
  }));

  const totalRevenue = chartData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const percent = ((payload[0].value / totalRevenue) * 100).toFixed(0);
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
            {payload[0].name}
          </Typography>
          <Typography sx={{ color: '#60aaff', fontSize: '0.85rem' }}>
            Revenue: {formatCurrency(payload[0].value)}
          </Typography>
          <Typography sx={{ color: '#9abde0', fontSize: '0.8rem', marginTop: '4px' }}>
            {percent}% of total
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box>
      <ResponsiveContainer width="100%" height={190}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            outerRadius={70}
            innerRadius={45}
            fill="#8884d8"
            dataKey="value"
            stroke="#0b1d36"
            strokeWidth={5}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={NEON_COLORS[index % NEON_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <Box className="region-legend">
        {chartData.map((entry, index) => {
          const percent = ((entry.value / totalRevenue) * 100).toFixed(0);
          return (
            <span key={index}>
              <span style={{
                background: NEON_COLORS[index % NEON_COLORS.length],
                width: '16px',
                height: '16px',
                borderRadius: '20px',
                display: 'inline-block'
              }}></span> {entry.name} {percent}%
            </span>
          );
        })}
      </Box>
    </Box>
  );
};

export default RevenueByRegionChart;
