const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
  getRecentActivity,
} = require('../controllers/dashboardController');

router.use(authMiddleware);

router.get('/summary', requireRole(['VIEWER', 'ANALYST', 'ADMIN']), getSummary);
router.get('/by-category', requireRole(['ANALYST', 'ADMIN']), getCategoryBreakdown);
router.get('/trends', requireRole(['ANALYST', 'ADMIN']), getMonthlyTrends);
router.get('/recent', requireRole(['ANALYST', 'ADMIN']), getRecentActivity);

module.exports = router;