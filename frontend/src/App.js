import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import Dashboard from './components/Dashboard';
import { fetchCategories, fetchRegions } from './store/slices/salesSlice';
import './App.css';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch categories and regions on app load
    dispatch(fetchCategories());
    dispatch(fetchRegions());
  }, [dispatch]);

  return (
    <Box sx={{ 
      position: 'relative', 
      zIndex: 5, 
      minHeight: '100vh', 
      padding: { xs: '16px', sm: '20px', md: '28px 36px' }
    }}>
      <Dashboard />
    </Box>
  );
}

export default App;
