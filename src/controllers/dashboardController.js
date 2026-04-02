const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getSummary = async (req, res) => {
  try {
    const [income, expense] = await Promise.all([
      prisma.transaction.aggregate({
        where: { type: 'INCOME', isDeleted: false },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { type: 'EXPENSE', isDeleted: false },
        _sum: { amount: true },
      }),
    ]);

    const totalIncome = income._sum.amount || 0;
    const totalExpenses = expense._sum.amount || 0;
    const netBalance = totalIncome - totalExpenses;

    res.status(200).json({
      totalIncome,
      totalExpenses,
      netBalance,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

const getCategoryBreakdown = async (req, res) => {
  try {
    const breakdown = await prisma.transaction.groupBy({
      by: ['category', 'type'],
      where: { isDeleted: false },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
    });

    const result = breakdown.map((item) => ({
      category: item.category,
      type: item.type,
      total: item._sum.amount || 0,
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

const getMonthlyTrends = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { isDeleted: false },
      select: { amount: true, type: true, date: true },
      orderBy: { date: 'asc' },
    });

    const trendsMap = {};

    for (const txn of transactions) {
      const date = new Date(txn.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!trendsMap[key]) {
        trendsMap[key] = { month: key, income: 0, expenses: 0, net: 0 };
      }

      if (txn.type === 'INCOME') {
        trendsMap[key].income += txn.amount;
      } else {
        trendsMap[key].expenses += txn.amount;
      }

      trendsMap[key].net = trendsMap[key].income - trendsMap[key].expenses;
    }

    res.status(200).json(Object.values(trendsMap));
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

const getRecentActivity = async (req, res) => {
  try {
    const recent = await prisma.transaction.findMany({
      where: { isDeleted: false },
      orderBy: { date: 'desc' },
      take: 10,
      select: {
        id: true,
        amount: true,
        type: true,
        category: true,
        date: true,
        notes: true,
      },
    });

    res.status(200).json(recent);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

module.exports = { getSummary, getCategoryBreakdown, getMonthlyTrends, getRecentActivity };