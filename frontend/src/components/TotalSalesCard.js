import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import './TotalSalesCard.css';

const TotalSalesCard = ({ data, loading, metricType, revenueByRegion }) => {
  if (loading && !data) {
    return (
      <Box className="metric-neon glass-panel">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress sx={{ color: '#3ca9ff' }} />
        </Box>
      </Box>
    );
  }

  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(2)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(2)}k`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}k`;
    }
    return new Intl.NumberFormat('en-US').format(num || 0);
  };

  const getMetricData = () => {
    switch (metricType) {
      case 'revenue':
        return {
          label: 'total revenue',
          icon: 'fas fa-chart-pie',
          value: formatCurrency(data?.totalRevenue),
          trend: '+12.3% vs last month',
        };
      case 'sales':
        return {
          label: 'total sales',
          icon: 'fas fa-shopping-bag',
          value: formatNumber(data?.totalQuantity),
          trend: '+7.2%',
        };
      case 'avgOrder':
        const avgOrder = data?.totalRevenue && data?.totalTransactions 
          ? data.totalRevenue / data.totalTransactions 
          : 0;
        return {
          label: 'avg. order',
          icon: 'fas fa-tag',
          value: formatCurrency(avgOrder),
          trend: '-2.1%',
          trendColor: '#ffaa33',
        };
      case 'topRegion':
        const topRegion = revenueByRegion && revenueByRegion.length > 0
          ? revenueByRegion[0]
          : null;
        const regionShare = topRegion && data?.totalRevenue
          ? ((topRegion.totalRevenue / data.totalRevenue) * 100).toFixed(0)
          : '0';
        return {
          label: 'top region',
          icon: 'fas fa-crown',
          value: topRegion?.region || 'N/A',
          trend: `${regionShare}% share`,
        };
      default:
        return {
          label: 'total revenue',
          icon: 'fas fa-chart-pie',
          value: formatCurrency(data?.totalRevenue),
          trend: '+12.3%',
        };
    }
  };

  const metric = getMetricData();

  return (
    <Box className="metric-neon glass-panel">
      <Box className="metric-label">
        <i className={metric.icon}></i> {metric.label}
      </Box>
      <Box className="metric-value">{metric.value}</Box>
      <Box 
        className="trend-up" 
        style={metric.trendColor ? { borderColor: metric.trendColor, color: metric.trendColor === '#ffaa33' ? '#ffcb87' : '#a0ffd0' } : {}}
      >
        <i className={`fas fa-arrow-${metric.trend.startsWith('+') ? 'up' : metric.trend.startsWith('-') ? 'down' : 'minus'}`}></i> {metric.trend}
      </Box>
    </Box>
  );
};

export default TotalSalesCard;
