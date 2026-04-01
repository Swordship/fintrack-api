const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const authRoutes = require('./routes/authRoute.js');
const clientRoutes = require('./routes/clientRoute.js');
const invoiceRoutes = require('./routes/invoiceRoute.js');
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

app.use('/auth' ,authRoutes);
app.use('/clients', clientRoutes);
app.use('/invoices',invoiceRoutes);
app.use(errorhandeler);
module.exports = app;