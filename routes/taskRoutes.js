const express = require('express');
const {
    createTask,
    updateStatus,
    addComment,
    listTasks
} = require('../controllers/taskController');

const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, restrictTo('manager'), createTask);
router.put('/:id/status', protect, restrictTo('employee'), updateStatus);
router.post('/:id/comment', protect, restrictTo('employee', 'manager'), addComment);
router.get('/', protect, listTasks);

module.exports = router;
