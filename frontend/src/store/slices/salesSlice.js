import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import salesAPI from '../../services/salesAPI';

// Async thunks
export const importSalesData = createAsyncThunk(
  'sales/import',
  async (file, { rejectWithValue }) => {
    try {
      const response = await salesAPI.importSalesData(file);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTotalSalesRevenue = createAsyncThunk(
  'sales/fetchTotal',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await salesAPI.getTotalSalesRevenue(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchSalesTrend = createAsyncThunk(
  'sales/fetchTrend',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await salesAPI.getSalesTrend(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchProductWiseSales = createAsyncThunk(
  'sales/fetchProducts',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await salesAPI.getProductWiseSales(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchRevenueByRegion = createAsyncThunk(
  'sales/fetchRevenueByRegion',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await salesAPI.getRevenueByRegion(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'sales/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await salesAPI.getCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchRegions = createAsyncThunk(
  'sales/fetchRegionsList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await salesAPI.getRegions();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const salesSlice = createSlice({
  name: 'sales',
  initialState: {
    totalSalesRevenue: null,
    salesTrend: [],
    productWiseSales: [],
    revenueByRegion: [],
    categories: [],
    regions: [],
    loading: false,
    error: null,
    importStatus: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearImportStatus: (state) => {
      state.importStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Import sales data
      .addCase(importSalesData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.importStatus = null;
      })
      .addCase(importSalesData.fulfilled, (state, action) => {
        state.loading = false;
        state.importStatus = 'success';
      })
      .addCase(importSalesData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.importStatus = 'error';
      })
      // Fetch total sales revenue
      .addCase(fetchTotalSalesRevenue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTotalSalesRevenue.fulfilled, (state, action) => {
        state.loading = false;
        state.totalSalesRevenue = action.payload.data;
      })
      .addCase(fetchTotalSalesRevenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch sales trend
      .addCase(fetchSalesTrend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesTrend.fulfilled, (state, action) => {
        state.loading = false;
        state.salesTrend = action.payload.data;
      })
      .addCase(fetchSalesTrend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch product-wise sales
      .addCase(fetchProductWiseSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductWiseSales.fulfilled, (state, action) => {
        state.loading = false;
        state.productWiseSales = action.payload.data;
      })
      .addCase(fetchProductWiseSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch revenue by region
      .addCase(fetchRevenueByRegion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRevenueByRegion.fulfilled, (state, action) => {
        state.loading = false;
        state.revenueByRegion = action.payload.data;
      })
      .addCase(fetchRevenueByRegion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload.data;
      })
      // Fetch regions list
      .addCase(fetchRegions.fulfilled, (state, action) => {
        state.regions = action.payload.data;
      })
      .addCase(fetchRegions.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, clearImportStatus } = salesSlice.actions;
export default salesSlice.reducer;
