import React, { useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import Dashboard from './components/Dashboard';
import { fetchCategories, fetchRegions } from './store/slices/salesSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch categories and regions on app load
    dispatch(fetchCategories());
    dispatch(fetchRegions());
  }, [dispatch]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sales & Revenue Analytics Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Dashboard />
      </Container>
    </Box>
  );
}

export default App;
