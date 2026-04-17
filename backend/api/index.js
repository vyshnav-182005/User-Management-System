const app = require('../src/app');
const connectDB = require('../src/config/db');
const { ensureAdminUser } = require('../src/services/bootstrap.service');

let bootstrapPromise = null;

module.exports = async (req, res) => {
  if (req.url === '/health') {
    return app(req, res);
  }

  try {
    if (!bootstrapPromise) {
      bootstrapPromise = (async () => {
        await connectDB();
        await ensureAdminUser();
      })().catch((error) => {
        bootstrapPromise = null;
        throw error;
      });
    }

    await bootstrapPromise;
    return app(req, res);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Serverless bootstrap failed', error);
    return res.status(500).json({
      message: 'Server bootstrap failed',
    });
  }
};
