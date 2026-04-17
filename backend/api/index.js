const app = require('../src/app');
const connectDB = require('../src/config/db');
const { ensureAdminUser } = require('../src/services/bootstrap.service');

let bootstrapPromise = null;

module.exports = async (req, res) => {
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
};
