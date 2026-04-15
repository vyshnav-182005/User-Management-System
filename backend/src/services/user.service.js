const ApiError = require('../utils/apiError');
const User = require('../models/User');
const { ROLES } = require('../utils/constants');

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  username: user.username,
  role: user.role,
  status: user.status,
  createdBy: user.createdBy,
  updatedBy: user.updatedBy,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

const createUser = async (payload, actorId) => {
  const existingUser = await User.findOne({
    $or: [{ email: payload.email.toLowerCase() }, { username: payload.username }],
  });

  if (existingUser) {
    throw new ApiError(409, 'Email or username already exists');
  }

  const user = await User.create({
    ...payload,
    email: payload.email.toLowerCase(),
    createdBy: actorId || null,
    updatedBy: actorId || null,
  });

  return sanitizeUser(user);
};

const listUsers = async ({ page, limit, search, role, status }) => {
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { username: { $regex: search, $options: 'i' } },
    ];
  }

  if (role) {
    query.role = role;
  }

  if (status) {
    query.status = status;
  }

  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(query),
  ]);

  return {
    users: users.map((user) => sanitizeUser(user)),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const updateUserById = async (targetId, payload, actor) => {
  const user = await getUserById(targetId);

  if (
    actor.role === ROLES.MANAGER &&
    (user.role === ROLES.ADMIN || payload.role === ROLES.ADMIN)
  ) {
    throw new ApiError(403, 'Managers cannot update admin users');
  }

  const uniqueCheck = [];
  if (payload.email && payload.email.toLowerCase() !== user.email) {
    uniqueCheck.push({ email: payload.email.toLowerCase() });
  }
  if (payload.username && payload.username !== user.username) {
    uniqueCheck.push({ username: payload.username });
  }

  if (uniqueCheck.length > 0) {
    const duplicate = await User.findOne({
      $and: [{ _id: { $ne: user._id } }, { $or: uniqueCheck }],
    });

    if (duplicate) {
      throw new ApiError(409, 'Email or username already exists');
    }
  }

  const updatable = {
    name: payload.name,
    email: payload.email ? payload.email.toLowerCase() : undefined,
    username: payload.username,
    role: payload.role,
    status: payload.status,
    updatedBy: actor._id,
  };

  Object.keys(updatable).forEach((key) => {
    if (typeof updatable[key] === 'undefined') {
      delete updatable[key];
    }
  });

  if (payload.password) {
    user.password = payload.password;
  }

  Object.assign(user, updatable);
  await user.save();

  return sanitizeUser(user);
};

const deleteUserById = async (targetId, actor) => {
  const user = await getUserById(targetId);

  if (user.role === ROLES.ADMIN && actor.role !== ROLES.ADMIN) {
    throw new ApiError(403, 'Only admin can delete admin users');
  }

  await user.deleteOne();
};

const getProfile = async (userId) => {
  const user = await getUserById(userId);
  return sanitizeUser(user);
};

const updateProfile = async (userId, payload) => {
  const user = await getUserById(userId);

  if (payload.name) {
    user.name = payload.name;
  }

  if (payload.password) {
    user.password = payload.password;
  }

  user.updatedBy = user._id;
  await user.save();

  return sanitizeUser(user);
};

module.exports = {
  createUser,
  listUsers,
  updateUserById,
  deleteUserById,
  getProfile,
  updateProfile,
};
