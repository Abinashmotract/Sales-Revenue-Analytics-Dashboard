const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  importSalesData,
  getTotalSalesRevenue,
  getFilteredSales,
  getSalesTrend,
  getProductWiseSales,
  getRevenueByRegion,
  getCategories,
  getRegions
} = require('../controllers/salesController');

// Import sales data
router.post('/import', upload.single('file'), importSalesData);

// Get total sales and revenue
router.get('/total', getTotalSalesRevenue);

// Get filtered sales
router.get('/filtered', getFilteredSales);

// Get sales trend
router.get('/trend', getSalesTrend);

// Get product-wise sales
router.get('/products', getProductWiseSales);

// Get revenue by region
router.get('/regions', getRevenueByRegion);

// Get unique categories
router.get('/categories', getCategories);

// Get unique regions list
router.get('/regions-list', getRegions);

module.exports = router;
