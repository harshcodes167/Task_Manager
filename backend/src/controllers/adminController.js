const User = require('../models/User');
const Task = require('../models/Task');
const { sendSuccess, sendError } = require('../utils/response');

// GET /api/v1/admin/users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return sendSuccess(res, 200, 'Users fetched.', { users, total: users.length });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/admin/users/:id
const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return sendError(res, 400, 'You cannot delete yourself.');
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return sendError(res, 404, 'User not found.');
    await Task.deleteMany({ user: req.params.id });
    return sendSuccess(res, 200, 'User and their tasks deleted.');
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/admin/stats
const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalTasks, tasksByStatus] = await Promise.all([
      User.countDocuments(),
      Task.countDocuments(),
      Task.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    ]);
    return sendSuccess(res, 200, 'Stats fetched.', { totalUsers, totalTasks, tasksByStatus });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, deleteUser, getStats };
