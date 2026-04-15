const asyncHandler = require('../utils/asyncHandler');
const userService = require('../services/user.service');

const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body, req.user._id);
  return res.status(201).json(user);
});

const listUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const result = await userService.listUsers({
    page,
    limit,
    search: req.query.search,
    role: req.query.role,
    status: req.query.status,
  });

  return res.status(200).json(result);
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUserById(req.params.id, req.body, req.user);
  return res.status(200).json(user);
});

const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUserById(req.params.id, req.user);
  return res.status(204).send();
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.user._id);
  return res.status(200).json(user);
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user._id, req.body);
  return res.status(200).json(user);
});

module.exports = {
  createUser,
  listUsers,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
};
