const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');
const { createTransactionSchema, updateTransactionSchema } = require('../schema/transactionSchema');
const {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController');

router.use(authMiddleware);

router.get('/', requireRole(['VIEWER', 'ANALYST', 'ADMIN']), getAllTransactions);
router.get('/:id', requireRole(['VIEWER', 'ANALYST', 'ADMIN']), getTransactionById);
router.post('/', requireRole(['ADMIN']), validate(createTransactionSchema), createTransaction);
router.patch('/:id', requireRole(['ADMIN']), validate(updateTransactionSchema), updateTransaction);
router.delete('/:id', requireRole(['ADMIN']), deleteTransaction);

module.exports = router;