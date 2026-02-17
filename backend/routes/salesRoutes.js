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

// Get Product Wise Sales
router.get('/products', getProductWiseSales);

// Get Revenue By Region
router.get('/regions', getRevenueByRegion);

// Get unique categories
router.get('/categories', getCategories);

// Get unique regions list
router.get('/regions-list', getRegions);

module.exports = router;
