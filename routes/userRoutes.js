const express = require('express');
const {
    updateUser,
    softDeleteUser,
    getUsers,
    searchUsers
} = require('../controllers/userController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

router.put('/:id', protect, restrictTo('admin'), updateUser);
router.delete('/:id', protect, restrictTo('admin'), softDeleteUser);
router.get('/', protect, restrictTo('admin'), getUsers);
router.get('/search', protect, restrictTo('admin'), searchUsers);

module.exports = router;
