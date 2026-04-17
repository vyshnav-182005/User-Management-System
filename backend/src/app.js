const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const env = require('./config/env');
const routes = require('./routes');
const errorHandler = require('./middleware/error.middleware');

const app = express();

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const matchesAllowedOrigin = (requestOrigin, allowedOrigin) => {
  if (allowedOrigin === '*') {
    return true;
  }

  if (requestOrigin === allowedOrigin) {
    return true;
  }

  if (!allowedOrigin.includes('*')) {
    return false;
  }

  const pattern = `^${escapeRegex(allowedOrigin).replace(/\\\*/g, '.*')}$`;
  return new RegExp(pattern, 'i').test(requestOrigin);
};

const corsOriginValidator = (requestOrigin, callback) => {
  // Allow same-origin/non-browser calls (no Origin header).
  if (!requestOrigin) {
    callback(null, true);
    return;
  }

  const normalizedRequestOrigin = requestOrigin.replace(/\/$/, '');
  const isAllowed = env.corsOrigin.some((allowedOrigin) =>
    matchesAllowedOrigin(normalizedRequestOrigin, allowedOrigin)
  );

  if (isAllowed) {
    callback(null, true);
    return;
  }

  callback(new Error(`CORS blocked for origin: ${normalizedRequestOrigin}`));
};

app.use(
  cors({
    origin: corsOriginValidator,
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'User Management API is running',
    health: '/health',
    apiBase: '/api/v1',
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'Use /api/v1 for API routes',
    apiBase: '/api/v1',
  });
});

app.use('/api/v1', routes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;
