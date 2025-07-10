require('reflect-metadata');
require('dotenv').config();
const express = require('express');
const { authorizer } = require('./auth/middleware');
const { AppDataSource } = require('./db/index');
const { logger: log } = require('./utils/log/index');

const app = express();

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(require('cors')());
app.use(require('morgan')('dev'));
app.use(require('body-parser').json());

// Route setup
app.use(authorizer);
app.use('/api', require('./routes/index'));

// Test route
app.get('/test', (req, res) => {
  res.status(200).send('Application Started');
});

// Health check endpoint for Docker
app.get('/health', (req, res) => {
  try {
    // Check if database is connected
    if (AppDataSource.isInitialized) {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
        uptime: process.uptime(),
      });
    } else {
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        uptime: process.uptime(),
      });
    }
  } catch (error) {
    log.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      uptime: process.uptime(),
    });
  }
});

// Catch-all route for invalid endpoints
app.use('*', (req, res, next) => {
  try {
    return res.status(404).json({
      message: 'Invalid Route',
    });
  } catch (error) {
    next(error);
  }
});

// Error handler

// Async function to initialize database and start server
async function startServer() {
  try {
    // Initialize TypeORM DataSource
    await AppDataSource.initialize();
    log.info('✅ Database connection established');

    // Start the server only after successful DB connection
    app.listen(3000, () => {
      log.info('✅ Server Listening on port 3000');
    });
  } catch (error) {
    log.error('❌ Error connecting to database:', error);
    process.exit(1); // Exit process if DB connection fails
  }
}

// Start the application
startServer();
