require("dotenv").config()
require("./utilities/database")
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors'); // <-- Add this line


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const companiesRouter = require('./routes/companies');
const debitPartiesRouter = require('./routes/debitParties');
const masterDataRouter = require('./routes/masterData');
const salesTransactionsRouter = require('./routes/salesTransactions');
const receiptTransactionsRouter = require('./routes/receiptTransactions');

const app = express();

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: '*', // You can restrict this to specific domains if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// Routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/companies', companiesRouter);
app.use('/debit-parties', debitPartiesRouter);
app.use('/master-data', masterDataRouter);
app.use('/sales-transactions', salesTransactionsRouter);
app.use('/receipt-transactions', receiptTransactionsRouter);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

module.exports = app;
