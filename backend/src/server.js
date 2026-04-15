const env = require('./config/env');
const connectDB = require('./config/db');
const app = require('./app');
const { ensureAdminUser } = require('./services/bootstrap.service');

const startServer = async () => {
  try {
    await connectDB();
    await ensureAdminUser();

    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
