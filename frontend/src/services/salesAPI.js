import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const salesAPI = {
  importSalesData: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API_BASE_URL}/sales/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getTotalSalesRevenue: (filters = {}) => {
    return axios.get(`${API_BASE_URL}/sales/total`, { params: filters });
  },

  getSalesTrend: (filters = {}) => {
    return axios.get(`${API_BASE_URL}/sales/trend`, { params: filters });
  },

  getProductWiseSales: (filters = {}) => {
    return axios.get(`${API_BASE_URL}/sales/products`, { params: filters });
  },

  getRevenueByRegion: (filters = {}) => {
    return axios.get(`${API_BASE_URL}/sales/regions`, { params: filters });
  },

  getCategories: () => {
    return axios.get(`${API_BASE_URL}/sales/categories`);
  },

  getRegions: () => {
    return axios.get(`${API_BASE_URL}/sales/regions-list`);
  },
};

export default salesAPI;
