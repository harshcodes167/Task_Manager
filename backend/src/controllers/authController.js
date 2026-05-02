const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/response');

// POST /api/v1/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 400, 'Email already registered.');
    }

    // Only allow admin role if explicitly set (for demo; in prod you'd restrict this)
    const userRole = role === 'admin' ? 'admin' : 'user';

    const user = await User.create({ name, email, password, role: userRole });
    const token = generateToken(user._id, user.role);

    return sendSuccess(res, 201, 'Registration successful.', {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return sendError(res, 401, 'Invalid email or password.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 401, 'Invalid email or password.');
    }

    if (!user.isActive) {
      return sendError(res, 401, 'Account is deactivated. Contact support.');
    }

    const token = generateToken(user._id, user.role);

    return sendSuccess(res, 200, 'Login successful.', {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/auth/me
const getMe = async (req, res, next) => {
  try {
    return sendSuccess(res, 200, 'User fetched.', {
      user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role, createdAt: req.user.createdAt },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };
