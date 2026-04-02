const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createTransaction = async (req, res) => {
  const { amount, type, category, date, notes } = req.body;
  const userId = req.user.userId;

  try {
    const transaction = await prisma.transaction.create({
      data: {
        amount,
        type,
        category,
        date: new Date(date),
        notes,
        userId,
      },
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

const getAllTransactions = async (req, res) => {
  const { type, category, from, to, page = 1, limit = 10 } = req.query;

  const where = { isDeleted: false };

  if (type) where.type = type;
  if (category) where.category = { contains: category, mode: 'insensitive' };
  if (from || to) {
    where.date = {};
    if (from) where.date.gte = new Date(from);
    if (to) where.date.lte = new Date(to);
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  try {
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { date: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.transaction.count({ where }),
    ]);

    res.status(200).json({
      data: transactions,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

const getTransactionById = async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await prisma.transaction.findFirst({
      where: { id, isDeleted: false },
    });
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  if (data.date) data.date = new Date(data.date);

  try {
    const transaction = await prisma.transaction.findFirst({
      where: { id, isDeleted: false },
    });
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data,
    });
    res.status(200).json({ message: 'Transaction updated successfully', transaction: updated });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await prisma.transaction.findFirst({
      where: { id, isDeleted: false },
    });
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    await prisma.transaction.update({
      where: { id },
      data: { isDeleted: true },
    });
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};