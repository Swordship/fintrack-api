const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');
const { updateRoleSchema, updateStatusSchema } = require('../schema/userSchema');
const { getAllUsers, getUserById, updateRole, updateStatus } = require('../controllers/userController');

router.use(authMiddleware);
router.use(requireRole(['ADMIN']));

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.patch('/:id/role', validate(updateRoleSchema), updateRole);
router.patch('/:id/status', validate(updateStatusSchema), updateStatus);

module.exports = router;