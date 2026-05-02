const Task = require('../models/Task');
const { sendSuccess, sendError } = require('../utils/response');

// GET /api/v1/tasks — get all tasks (admin: all, user: own)
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;
    const filter = req.user.role === 'admin' ? {} : { user: req.user._id };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [tasks, total] = await Promise.all([
      Task.find(filter).populate('user', 'name email').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Task.countDocuments(filter),
    ]);

    return sendSuccess(res, 200, 'Tasks fetched.', {
      tasks,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/tasks/:id
const getTask = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user.role !== 'admin') filter.user = req.user._id;

    const task = await Task.findOne(filter).populate('user', 'name email');
    if (!task) return sendError(res, 404, 'Task not found.');

    return sendSuccess(res, 200, 'Task fetched.', { task });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/tasks
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const task = await Task.create({ title, description, status, priority, dueDate, user: req.user._id });

    return sendSuccess(res, 201, 'Task created.', { task });
  } catch (error) {
    next(error);
  }
};

// PUT /api/v1/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user.role !== 'admin') filter.user = req.user._id;

    const task = await Task.findOneAndUpdate(filter, req.body, { new: true, runValidators: true });
    if (!task) return sendError(res, 404, 'Task not found or unauthorized.');

    return sendSuccess(res, 200, 'Task updated.', { task });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user.role !== 'admin') filter.user = req.user._id;

    const task = await Task.findOneAndDelete(filter);
    if (!task) return sendError(res, 404, 'Task not found or unauthorized.');

    return sendSuccess(res, 200, 'Task deleted.');
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
