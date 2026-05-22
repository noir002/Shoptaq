const Sale = require('../models/Sale');
const Product = require('../models/Product');

// @desc    Get dashboard analytics overview
// @route   GET /api/analytics/overview
// @access  Private
const getOverview = async (req, res) => {
  try {
    // Total revenue
    const revenueResult = await Sale.aggregate([
      { $group: { _id: null, total: { $sum: '$revenue' } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Total orders (sales count)
    const totalOrders = await Sale.countDocuments();

    // Total products
    const totalProducts = await Product.countDocuments();

    // Low stock products
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
      .select('title stock category image')
      .limit(10);

    // Out of stock count
    const outOfStock = await Product.countDocuments({ stock: 0 });

    // Average order value
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    res.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      avgOrderValue,
      lowStockProducts,
      outOfStock,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get monthly sales data (last 12 months)
// @route   GET /api/analytics/monthly
// @access  Private
const getMonthlySales = async (req, res) => {
  try {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const monthlySales = await Sale.aggregate([
      { $match: { date: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          revenue: { $sum: '$revenue' },
          orders: { $sum: 1 },
          units: { $sum: '$quantity' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Fill in all 12 months even if no data
    const result = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const found = monthlySales.find((s) => s._id.year === year && s._id.month === month);
      result.push({
        label: `${months[month - 1]} ${year}`,
        month: months[month - 1],
        revenue: found?.revenue || 0,
        orders: found?.orders || 0,
        units: found?.units || 0,
      });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get top selling products
// @route   GET /api/analytics/top-products
// @access  Private
const getTopProducts = async (req, res) => {
  try {
    const topProducts = await Sale.aggregate([
      {
        $group: {
          _id: '$product',
          productTitle: { $first: '$productTitle' },
          productCategory: { $first: '$productCategory' },
          totalRevenue: { $sum: '$revenue' },
          totalSold: { $sum: '$quantity' },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 },
    ]);

    res.json(topProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get inventory status by category
// @route   GET /api/analytics/inventory
// @access  Private
const getInventoryStatus = async (req, res) => {
  try {
    const inventory = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          totalStock: { $sum: '$stock' },
          productCount: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          lowStockCount: {
            $sum: { $cond: [{ $lt: ['$stock', 10] }, 1, 0] },
          },
        },
      },
      { $sort: { totalStock: -1 } },
    ]);

    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product growth data (products added over time)
// @route   GET /api/analytics/growth
// @access  Private
const getProductGrowth = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const growth = await Product.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const found = growth.find((g) => g._id.year === year && g._id.month === month);
      result.push({ label: months[month - 1], count: found?.count || 0 });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getOverview, getMonthlySales, getTopProducts, getInventoryStatus, getProductGrowth };
