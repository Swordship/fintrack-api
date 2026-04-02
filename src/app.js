const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const authRoutes = require('./routes/authRoute.js');
const { errorhandeler } = require('./middleware/errorHandler.js');
const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});
const authMiddleware = require('./middleware/authMiddleware');
const requireRole = require('./middleware/roleMiddleware');

app.get('/test-admin', authMiddleware, requireRole(['ADMIN']), (req, res) => {
  res.json({ message: 'You are an ADMIN', user: req.user });
});
app.use('/auth' ,authRoutes);
const userRoutes = require('./routes/userRoute');
app.use('/users', userRoutes);
const transactionRoutes = require('./routes/transactionRoute');
app.use('/transactions', transactionRoutes);
app.use(errorhandeler);
module.exports = app;