const User = require('../models/User');
const env = require('../config/env');
const { ROLES, USER_STATUSES } = require('../utils/constants');

const ensureAdminUser = async () => {
  if (!env.adminEmail || !env.adminUsername || !env.adminPassword) {
    return;
  }

  const existing = await User.findOne({
    $or: [{ email: env.adminEmail.toLowerCase() }, { username: env.adminUsername }],
  }).select('+password');

  if (existing) {
    const shouldUpdateEmail = existing.email !== env.adminEmail.toLowerCase();
    const shouldUpdateUsername = existing.username !== env.adminUsername;
    const shouldUpdateRole = existing.role !== ROLES.ADMIN;
    const shouldUpdateStatus = existing.status !== USER_STATUSES.ACTIVE;
    const shouldUpdatePassword = !(await existing.comparePassword(env.adminPassword));

    if (
      shouldUpdateEmail ||
      shouldUpdateUsername ||
      shouldUpdateRole ||
      shouldUpdateStatus ||
      shouldUpdatePassword
    ) {
      existing.email = env.adminEmail.toLowerCase();
      existing.username = env.adminUsername;
      existing.role = ROLES.ADMIN;
      existing.status = USER_STATUSES.ACTIVE;

      if (shouldUpdatePassword) {
        existing.password = env.adminPassword;
      }

      await existing.save();
    }

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
