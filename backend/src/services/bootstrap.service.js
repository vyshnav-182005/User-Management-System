const User = require('../models/User');
const env = require('../config/env');
const { ROLES, USER_STATUSES } = require('../utils/constants');

const ensureAdminUser = async () => {
  if (!env.adminEmail || !env.adminUsername || !env.adminPassword) {
    return;
  }

  const existing = await User.findOne({
    $or: [{ email: env.adminEmail.toLowerCase() }, { username: env.adminUsername }],
  });

  if (existing) {
    return;
  }

  await User.create({
    name: 'System Admin',
    email: env.adminEmail.toLowerCase(),
    username: env.adminUsername,
    password: env.adminPassword,
    role: ROLES.ADMIN,
    status: USER_STATUSES.ACTIVE,
  });
};

module.exports = {
  ensureAdminUser,
};
