const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/userRoute');
const transactionRoutes = require('./routes/transactionRoute');
const dashboardRoutes = require('./routes/dashboardRoute');
const { errorhandeler } = require('./middleware/errorHandler');

const prisma = new PrismaClient();
const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'OK',
      database: 'connected',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
    });
  }
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/transactions', transactionRoutes);
app.use('/dashboard', dashboardRoutes);

app.use(errorhandeler);

module.exports = app;