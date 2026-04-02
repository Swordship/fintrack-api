const { z } = require('zod');

const createTransactionSchema = z.object({
  amount: z.number().positive('Amount must be a positive number'),
  type: z.enum(['INCOME', 'EXPENSE'], {
    errorMap: () => ({ message: "Type must be either INCOME or EXPENSE" }),
  }),
  category: z.string().min(1, 'Category is required'),
  date: z.string().datetime('Invalid date format. Use ISO 8601 format.'),
  notes: z.string().optional(),
});

const updateTransactionSchema = z.object({
  amount: z.number().positive('Amount must be a positive number').optional(),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  category: z.string().min(1).optional(),
  date: z.string().datetime('Invalid date format. Use ISO 8601 format.').optional(),
  notes: z.string().optional(),
});

module.exports = { createTransactionSchema, updateTransactionSchema };