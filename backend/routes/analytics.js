const express = require('express');
const router = express.Router();
const {
  getOverview,
  getMonthlySales,
  getTopProducts,
  getInventoryStatus,
  getProductGrowth,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/overview', getOverview);
router.get('/monthly', getMonthlySales);
router.get('/top-products', getTopProducts);
router.get('/inventory', getInventoryStatus);
router.get('/growth', getProductGrowth);

module.exports = router;
