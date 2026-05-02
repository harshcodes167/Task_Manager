const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, getStats } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const { objectIdValidator } = require('../validators');
const validate = require('../middleware/validate');

router.use(protect, authorize('admin'));

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Get platform stats (Admin only)
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Stats fetched
 *       403:
 *         description: Forbidden
 */
router.get('/stats', getStats);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Users fetched
 */
router.get('/users', getUsers);

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete('/users/:id', objectIdValidator, validate, deleteUser);

module.exports = router;
