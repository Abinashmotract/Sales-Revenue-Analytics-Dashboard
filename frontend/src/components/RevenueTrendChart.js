import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Box, CircularProgress, Typography } from '@mui/material';

const RevenueTrendChart = ({ data, loading }) => {
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
            {payload[0].payload.period}
          </Typography>
          {payload.map((entry, index) => (
            <Typography key={index} sx={{ color: entry.color, fontSize: '0.85rem' }}>
              {entry.name}: {entry.name === 'Revenue' ? formatCurrency(entry.value) : entry.value.toLocaleString()}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1c3f66" opacity={0.5} />
        <XAxis
          dataKey="period"
          tick={{ fontSize: 11, fill: '#aac9ff' }}
          stroke="#2d5080"
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#aac9ff' }}
          stroke="#2d5080"
          tickFormatter={(value) => formatCurrency(value)}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ color: '#9abde0', fontSize: '0.85rem' }}
          iconType="line"
        />
        <Line
          type="monotone"
          dataKey="totalRevenue"
          stroke="#60aaff"
          strokeWidth={3}
          name="Revenue"
          dot={{ r: 4, fill: '#c0e0ff', stroke: '#002244', strokeWidth: 2 }}
          activeDot={{ r: 8, fill: '#60aaff' }}
          fill="rgba(0, 160, 255, 0.15)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RevenueTrendChart;
